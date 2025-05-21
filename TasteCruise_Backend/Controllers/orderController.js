import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:5173";

const placeOrder = async (req, res) => {
  try {
    console.log("Req body is: ", req.body);
    const newOrder = await Order.create({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.totalAmount,
      address: `${req.body.deliveryData["street"]}, ${req.body.deliveryData["city"]}, ${req.body.deliveryData["state"]} - ${req.body.deliveryData["zipcode"]}`,
    });

    await User.update({ cartData: {} }, { where: { id: req.body.userId } });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charge" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    // const session = await stripe.checkout.sessions.create({
    //   success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder.id}`,
    //   cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder.id}`,
    //   line_items,
    //   mode: "payment",
    // });

    // res.json({ success: true, session_url: session.url });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const placeOrderCod = async (req, res) => {
  try {
    await Order.create({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });

    await User.update({ cartData: {} }, { where: { id: req.body.userId } });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.body.userId } });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await Order.update(
      { status: req.body.status },
      { where: { id: req.body.orderId } }
    );
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await Order.update({ payment: true }, { where: { id: orderId } });
      res.json({ success: true, message: "Paid" });
    } else {
      await Order.destroy({ where: { id: orderId } });
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not Verified" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  placeOrderCod,
};
