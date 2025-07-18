const express = require('express');
const productRouter =express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const { addProducts, getAllProducts, updateProduct, deleteProduct, uploadCsv, filterProduct, filterProductByPrice, addToCart, removeFromCart, addToWishlist, removeFromWishlist, wishlistToCart, displayProductsUser, displayCart, displayWishlist } = require('../controllers/productController');

const upload = multer({ dest: 'temp/' });

productRouter.post('/add/products',auth,role('admin'),addProducts);
productRouter.get('/view/products',auth,role('admin'),getAllProducts);
productRouter.get('/view/products/user',auth,role('customer'),displayProductsUser);
productRouter.put('/update/products/:id',auth,role('admin'),updateProduct);
productRouter.delete('/delete/products/:id',auth,role('admin'),deleteProduct);
productRouter.post('/upload-csv',auth,role('admin'), upload.single('file'), uploadCsv);
productRouter.get('/filter/products',auth, filterProduct);
productRouter.get('/filter/products/range',auth, filterProductByPrice);
productRouter.post('/add-to-cart/:id',auth,role('customer'),addToCart);
productRouter.get('/display/cart',auth,role('customer'),displayCart);
productRouter.delete('/remove-from-cart/:id',auth,role('customer'),removeFromCart)
productRouter.post('/add-to-wishlist/:id',auth,role('customer'),addToWishlist);
productRouter.delete('/remove-from-wishlist/:id',auth,role('customer'),removeFromWishlist);
productRouter.post('/wishlist-to-cart/:id',auth,role('customer'),wishlistToCart);
productRouter.get('/display/wishlist',auth,role('customer'),displayWishlist);


module.exports = productRouter;
