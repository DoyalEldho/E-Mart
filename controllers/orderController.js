const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel')
const approveEmail = require('../mailer/email');

exports.placeOrder = async (req, res) => {
  try {
    const { address, totalPrice, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate paymentMethod
    if (!['Online', 'COD'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const user = await userModel.findById(req.user.id).populate('cart.productId');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const products = user.cart.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      adminId: item.productId.userId
    }));

    const order = new orderModel({
      userId: user._id,
      products,
      totalPrice,
      address,
      paymentMethod,
      isPaid: paymentMethod === 'Online',
      paidAt: paymentMethod === 'Online' ? new Date() : null,
      status: 'processing'
    });

    await order.save();

    // email
      const findUser = await userModel.findById(req.user.id).populate('cart.productId');
    
    // Email subject
    const subject = 'Order Successfully Placed';

// Generate order summary HTML
const orderItemsHtml = user.cart.map(item => {
  const product = item.productId;
  return `
    <li>
      <strong>${product.title}</strong><br/>
      Quantity: ${item.quantity}<br/>
      Price: ₹${product.price} each
    </li>
  `;
}).join('');

const htmlContent = `
  <h2>Hi ${findUser.name},</h2>
  <p>We have successfully placed your order. Here are the details:</p>

  <ul style="padding-left: 16px;">
    ${orderItemsHtml}
  </ul>
  <p><strong>Total Amount:</strong> ₹${totalPrice}</p>

<p>Thanks again for choosing <span style="color: #FFD700;"><strong>E-Mart</strong></span>. Have a great day!</p>

`;
      await approveEmail(findUser.email, subject, '', htmlContent);


     user.cart = [];
    await user.save();

       res.json({ message: 'Order placed successfully', order });

  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};



//all orders
exports.orders = async(req,res)=>{

const { status } = req.query;
    try {

      const orders = await orderModel.find({
      products: { $elemMatch: { adminId: req.user.id } },
      status: status
    }).populate({path: 'userId',
      select: 'name email'
    })
    .populate({
   path: 'products.productId',
   select: 'title price image'
   });

 
   res.json(orders)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

//change status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const {  status } = req.body;

    if (!['processing', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to '${status}'`, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id })
      .populate('products.productId', 'title image price') 
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};































exports.getAdminChartData = async (req, res) => {
  try {
    const adminId = req.user.id;

    const orders = await orderModel.find({ 'products.adminId': adminId });

    //  Orders per day 
    const ordersPerDay = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0]; // "YYYY-MM-DD"
      if (!ordersPerDay[date]) ordersPerDay[date] = 0;
      ordersPerDay[date] += 1;
    });

    const ordersPerDayArr = Object.entries(ordersPerDay).map(([date, count]) => ({
      date,
      count,
    }));

    // Best-selling products 
    const productSales = {};

    orders.forEach(order => {
      order.products.forEach(p => {
        if (String(p.adminId) === adminId) {
          const productId = p.productId.toString();
          if (!productSales[productId]) productSales[productId] = 0;
          productSales[productId] += p.quantity;
        }
      });
    });

    // Fetch product titles
    const productIds = Object.keys(productSales);
    const products = await productModel.find({ _id: { $in: productIds } });

    const bestSellingProducts = products.map(prod => ({
      title: prod.title,
      quantity: productSales[prod._id.toString()],
    }));

    res.json({
      ordersPerDay: ordersPerDayArr,
      bestSellingProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Chart data fetch failed' });
  }
};
