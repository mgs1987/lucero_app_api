const { Router } = require("express");

const {
  getAllOrders,
  getOrderById,
  postOrder,
  putOrder,
  destroyOrder,
} = require("../controllers/orderController");

const { verifyToken } = require("../controllers/authController");

const router = Router();

router
  .get("/", getAllOrders)
  .get("/id/:id", getOrderById)
  .post("/", verifyToken, postOrder)
  .put("/", verifyToken, putOrder)
  .put("/delete/", verifyToken, destroyOrder);

module.exports = router;
