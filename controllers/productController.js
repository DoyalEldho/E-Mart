const productModel = require('../models/productModel');
const userModel =require('../models/userModel')
const uploadToCloudinary  = require('../utils/cloudinary');
const cloudinary = require('cloudinary').v2; //bcoz here using cloudinary built in destroy fn
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');


//add products
const addProducts = async(req,res)=>{

    const {title,description,category,price,stock,image,tags} = req.body;
    try {

     //image to cloudinary
        const { secure_url, public_id } = await uploadToCloudinary(image);

     const newProduct = new productModel({
      title,
      description,
      category,
      price,
      stock,
      image: secure_url, // Save image URL from Cloudinary
      imageId:public_id,
      tags,
      userId:req.user.id
    });

     await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Product creation failed', details: error.message });
  }

}

//fetch all products with pagination
const getAllProducts = async (req, res) => {
      
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
  try {
     const total = await productModel.countDocuments({userId:req.user.id});
    const products = await productModel.find({userId:req.user.id}).skip(skip).limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};

const displayProductsUser = async(req,res)=>{
   
  try {
    
    const products = await productModel.find();

    res.status(200).json(products);
  } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
}

//update data and image from cloudinary+mongodb
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { title, description, category, price, stock, image, tags } = req.body;

  try {
    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // assigning old image&id if image not edited
    let newImageUrl = existingProduct.image;
    let newImageId = existingProduct.imageId;

    //delete
    if (image && image !== existingProduct.image) {
      if (existingProduct.imageId) {
        await cloudinary.uploader.destroy(existingProduct.imageId);
      }

      //add
      const { secure_url, public_id } = await uploadToCloudinary(image);
      newImageUrl = secure_url;
      newImageId = public_id;
    }

    existingProduct.title = title || existingProduct.title;
    existingProduct.description = description || existingProduct.description;
    existingProduct.category = category || existingProduct.category;
    existingProduct.price = price || existingProduct.price;
    existingProduct.stock = stock || existingProduct.stock;
    existingProduct.image = newImageUrl;
    existingProduct.imageId = newImageId;
    existingProduct.tags = tags || existingProduct.tags;

    await existingProduct.save();

    res.status(200).json({ message: 'Product updated successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Product update failed', details: error.message });
  }
};

const deleteProduct = async(req,res)=>{
   
 const productId = req.params.id;
 try {
     const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (existingProduct.imageId) {
        await cloudinary.uploader.destroy(existingProduct.imageId);
      }
      await productModel.findByIdAndDelete(productId);
      res.json({message:"Product deleted sucessfully"})

 } catch (error) {
     res.status(500).json({ error: 'Product update failed', details: error.message });
     console.log(error);
     
 }

}

//bulk csv

const uploadCsv = async (req, res) => {
  const results = [];

  try {
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        for (const row of results) {
          try {
            const { secure_url, public_id } = await uploadToCloudinary(row.image);

            const newProduct = new productModel({
              title: row.title,
              description: row.description,
              category: row.category,
              price: parseFloat(row.price),
              stock: parseInt(row.stock),
              image: secure_url,
              imageId: public_id,
              tags: row.tags?.split(',').map(tag => tag.trim()) || [],
              userId: req.user.id 
            });

            await newProduct.save();
          } catch (uploadErr) {
            console.error('Image upload failed:', uploadErr.message);
          }
        }

        fs.unlinkSync(filePath); // remove the uploaded CSV
        res.status(201).json({ message: 'CSV imported and products saved.' });
      });
  } catch (error) {
    res.status(500).json({ error: 'CSV import failed', details: error.message });
  }
};

//filter by category
const filterProduct = async(req,res)=>{

  const {category} = req.query;
  try {
     
    const products = await productModel.find({category});
    if(products.length>0){
     return  res.json(products);
    }
    return res.status(404).json({message:"no search matches"})

  } catch (error) {
       res.status(500).json({ error: 'CSV import failed', details: error.message });
  }

}

//filter by price
const filterProductByPrice = async(req,res)=>{

  const {range} = req.query;
  try {
     
    const products = await productModel.find({price:{$lt:range}});
    if(products.length>0){
     return  res.json(products);
    }
    return res.status(404).json({message:"no search matches"})

  } catch (error) {
       res.status(500).json({ error: 'CSV import failed', details: error.message });
  }

}

//add to cart
const addToCart = async (req, res) => {
  const productId = req.params.id;
  const quantity  = 1;

  try {
    const userDB = await userModel.findById(req.user.id);

    // Check if product exists in Db
    const productExists = await productModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product already in cart and get index return
    const existingItemIndex = userDB.cart.findIndex(item =>
      item.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // If already in cart, update quantity
      userDB.cart[existingItemIndex].quantity += 1;
    } else {
      // If not in cart, push new product
      userDB.cart.push({ productId, quantity });
    }

    await userDB.save();

    res.json({ message: "Added to cart successfully", cart: userDB.cart });

  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
};

//display cart Item

const displayCart = async(req,res)=>{

  try {
        const userDB = await userModel.findById(req.user.id).populate('cart.productId');
        
        const cart = userDB.cart;
        res.json({cart:cart});
            
  } catch (error) {
     res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
}


//remove from cart

const removeFromCart =async(req,res)=>{

  const productId =req.params.id;
  try {
    const user = await userModel.findById(req.user.id);
  
    if(user.cart.length>0){
           user.cart = user.cart.filter(item=>item.productId.toString()!==productId); 
            await user.save();
        return res.json({message:"Removed From Cart"});
    }
    return res.json({message:"no items in cart"});

  } catch (error) {
      res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
}

//wishlist
const addToWishlist = async (req, res) => {
  const productId = req.params.id;

  try {
    const user = await userModel.findById(req.user.id);

    const alreadyInWishlist = user.wishlist.some(item => item.productId.toString() === productId); //return boolean
    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push({ productId });
    await user.save();

    res.json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist', details: error.message });
  }
};

//display wishlist

const displayWishlist = async(req,res)=>{

  try {
        const userDB = await userModel.findById(req.user.id).populate('wishlist.productId');
        
        const wishlist = userDB.wishlist;
        res.json({wishlist:wishlist});
            
  } catch (error) {
     res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
}


//remove from wishlist

const removeFromWishlist =async(req,res)=>{

  const productId =req.params.id;
  try {
    const user = await userModel.findById(req.user.id);
  
    if(user.wishlist.length>0){
           user.wishlist = user.wishlist.filter(item=>item._id.toString()!==productId); 
            await user.save();
        return res.json({message:"Removed From wishlist"});
    }
    return res.json({message:"no items in wishlist"});

  } catch (error) {
      res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
}

//move to cart from wishlist
const wishlistToCart=async(req,res)=>{

  const productId = req.params.id;
  const quantity  = req.body?.quantity ||1  
  try {
    
    const user = await userModel.findById(req.user.id);
      const wishlist=  user.wishlist.find(item=>item.productId.toString()===productId);
    
      if(!wishlist){
              return res.status(404).json({ message: "Product not in wishlist" });
      }

      //remove from wishlist
          user.wishlist = user.wishlist.filter(item => item._id.toString() !== wishlist._id.toString());

     //move to cart
      const existingCartItem = user.cart.find(item => item.productId.toString() === productId);
    if (existingCartItem) {
      existingCartItem.quantity += 1; // increment
    } else {
      user.cart.push({ productId:new mongoose.Types.ObjectId(productId), quantity });
    }

    await user.save();
    res.json({ message: "Moved to cart from wishlist" });   
       

  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
}

module.exports = {
addProducts,
getAllProducts,
updateProduct,
deleteProduct,
uploadCsv,
filterProduct,
filterProductByPrice,
addToCart,
removeFromCart,
addToWishlist,
removeFromWishlist,
wishlistToCart,
displayProductsUser,
displayCart,
displayWishlist
}