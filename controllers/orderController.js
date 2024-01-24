const Product = require("../models/product");
const Order = require("../models/order");
const { notFoundError, badRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");

//Fake Payment Intent - Similar to  Stripe
const fakePaymentIntent = async ({ amount, currency }) => {
  const clientSecret = "Some Random Secret";
  return { clientSecret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort("-createdAt");
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { orderID } = req.params;
  const order = await Order.findOne({
    _id: orderID,
  });
  if (!order) throw new notFoundError(`Order with id : ${orderID} not found`);
  checkPermissions(req.userDetails, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const { userID } = req.userDetails;
  const orders = await Order.find({
    user: userID,
  });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items } = req.body;
  let orderItems = [];
  let subTotal = 0;
  for (const item of items) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct)
      throw new notFoundError(`Product with id : ${item.product} not found`);
    const { name, price, image, _id } = dbProduct;
    const cartItems = {
      name,
      image,
      price,
      amount: item.amount,
      product: _id,
    };
    orderItems = [...orderItems, cartItems];
    subTotal += price * item.amount;
  }
  //calculate total
  const total = subTotal + tax + shippingFee;
  //get payment intent
  const paymentIntent = await fakePaymentIntent({
    amount: total,
    currency: "inr",
  });
  //create order
  const order = await Order.create({
    tax,
    shippingFee,
    subTotal,
    total,
    orderItems,
    user: req.userDetails.userID,
    clientSecret: paymentIntent.clientSecret,
  });
  res.status(StatusCodes.OK).json({
    order,
    clientSecret: order.clientSecret,
  });
};

const updateOrder = async (req, res) => {
  const { orderID } = req.params;
  const { paymentIntentID, status } = req.body;
  if (!paymentIntentID || !status)
    throw new badRequestError(
      "Please provide the payment intent id and status"
    );
  const order = await Order.findOne({
    _id: orderID,
  });
  if (!order) throw new notFoundError(`Not order with id : ${orderID} found`);
  checkPermissions(req.userDetails, order.user);
  order.paymentIntentID = paymentIntentID;
  order.status = status;
  await order.save();
  res.status(StatusCodes.OK).json({
    message: "Order Updated Successfully",
    order,
  });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
