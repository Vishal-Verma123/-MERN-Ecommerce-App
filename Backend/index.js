const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1000mb" }));

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
  const { email, password } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    if (result && result.password === password) {
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
      res.send({
        message: "Either email or password is invalid",
        alert: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//myprofile api
app.post("/myprofile", async (req, res) => {
  try {
    const { email, firstName, lastName, password, _id } = req.body;
    const result = await userModel.findOne({ _id: _id }).exec();

    if (result) {
      result.firstName = firstName;
      result.lastName = lastName;
      result.email = email;

      if (password) {
        result.password = password;
      }

      await result.save();

      res.send({
        message: "Successfully Updated Details!!",
        alert: true,
      });
    } else {
      res.send({
        message: "Something Wrong",
        alert: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//cart api
app.post("/cart", async (req, res) => {
  console.log(req.body);
  const { email, contact, address } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();

    if (email) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
        contact: contact,
        address: address,
      };
      console.log(dataSend);
      res.send({
        //message: "Successfully captured Details!!",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        //message: "Either fields are invalid",
        alert: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//forget_password api
app.post("/forget_password", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await userModel.findOne({ email: email }).exec();

    if (user) {
      // Check if the password and confirm password match
      if (password === confirmPassword) {
        // Update the password for the user
        user.password = password;
        user.confirmPassword = confirmPassword;
        await user.save();

        const dataSend = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
        };

        res.send({
          message: "Password successfully changed!",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Password and confirm password do not match.",
          alert: false,
        });
      }
    } else {
      res.send({
        message: "Email is not available, please sign up.",
        alert: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "An error occurred." });
  }
});

//newproduct section
const schemaProduct = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
  description: String,
});

//Newproduct model
const productModel = mongoose.model("product", schemaProduct);

app.post("/uploadProduct", async (req, res) => {
  try {
    console.log(req.body);
    const data = new productModel(req.body);
    await data.save();
    res.send({ message: "Upload successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Payment- Section
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1NGhtrSARVm9M7xebh0Uuk9G" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "INR",
            product_data: {
              name: item.name,
              //images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    console.log(session);
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

app.listen(PORT, () => console.log("Server is running at port: " + PORT));
