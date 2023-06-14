const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const PORT = 5000;
const jwt = require("jsonwebtoken");
// const JWT_SECRET_TOKEN = "rahulgirgal@123";
const { JWT_SECRET_TOKEN, MOGOURI } = require("./config/Keys");

const User = require("./model/user");

mongoose.connect(MOGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("Connnected to mango data base");
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

app.use(express.json());

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET_TOKEN);
    req.userExists = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "you must be logged in" });
  }
};

app.get("/test", requireLogin, (req, res) => {
  res.json({ message: req.userExists });
});

app.post("/signup", async (req, res) => {
  const { email, password, firstName } = req.body;
  console.log(req.body);
  try {
    if (!email || !password || !firstName) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(422).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful. You can now login." });

    // await new User({
    //   email,
    //   password,
    //   firstName
    // }).save();
    // res.status(200).json({ message: "Signup successful. You can now login." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ error: "user not exists, please signUp" });
    }
    // const isPasswordValid = await bcrypt.compare(password, userExists.password);
    // if (isPasswordValid) {
    //   const token = jwt.sign({ userId: userExists._id }, JWT_SECRET_TOKEN);
    //   return res.status(200).json({ token, firstName: userExists.firstName });
    // } else {
    //   return res.status(401).json({ error: "Invalid email or password" });
    // }
    if (password === userExists.password) {
      // const firstName = userExists.firstName;
      const token = jwt.sign({ userId: userExists._id }, JWT_SECRET_TOKEN);
      res.status(200).json({ token, firstName: userExists.firstName });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
  }
});

if (process.env.NODE_ENV == "production") {
  const path = require("path");

  app.use(express.static(path.resolve(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on ", PORT);
});
