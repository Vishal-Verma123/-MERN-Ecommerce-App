const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
//const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;
console.log(process.env.MONGODB_URL);

//Mongo-Connection

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

//Mongo-Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//Model
const userModel = mongoose.model("user", userSchema);

//Api
app.get("/", (req, res) => {
  res.send("Server is running!!");
});

//signup api
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = new userModel(req.body);
      await data.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//login api
app.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Successfully LoggedIn!!",
        alert: true,
        data: dataSend,
      });
    } else {
      const data = new userModel(req.body);
      //await data.save();
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//newproduct section
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
  description: String,
});

//Newproduct model
const productModel = mongoose.model("product", schemaProduct);

//upload product save product in database
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = await productModel(req.body);
  await data.save();
  res.send({ message: "Upload successfully!!" });
});

app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

app.listen(PORT, () => console.log("Server is running at port: " + PORT));
