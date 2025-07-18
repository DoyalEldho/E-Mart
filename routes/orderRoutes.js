const express = require('express');
const orderRouter =express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {  placeOrder, changeStatus, orders, updateOrderStatus, getUserOrders, getAdminChartData } = require('../controllers/orderController');

orderRouter.post('/place-order',auth,role('customer'),placeOrder);
orderRouter.get('/orders',auth,role('admin'),orders);
orderRouter.get('/orders/my-orders',auth,role('customer'),getUserOrders);
orderRouter.put('/change/status/:id',auth,role('admin'),updateOrderStatus);
orderRouter.get('/admin/charts', auth , role('admin'), getAdminChartData);

module.exports = orderRouter;