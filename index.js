const express = require("express");
const app = express();
const port = 3000;
const models = require("./models/model");
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Endpoint for handling signup submissions
app.post("/signup", async (req, res) => {
  try {
    const userExists = await models.User.findOne({ name: req.body.name });
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const newUser = new models.User(userData);

    await newUser.save();

    await sendMail(req.body.email, req.body.name);

    console.log("Signup stored");
    res.status(201).send("Signup successful");
  } catch (error) {
    console.log(`Error ${error.message}`);
    res.status(500).send("Error signing up");
  }
});

// email send code
const sendMail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "moinwkhan21@gmail.com",
        pass: "ruaocobykdbdxfhl",
      },
    });

    const info = await transporter.sendMail({
      from: "moinwkhan21@gmail.com",
      to: toEmail,
      subject: `Welcome to ProPulse Real Estate, ${name}!`,
      text: `Dear ${name},
    
    We are delighted to welcome you to ProPulse Real Estate! Your journey to finding the perfect property starts here.
    
    At ProPulse Real Estate, we are committed to helping you find your dream property, whether it's a cozy home, a spacious apartment, or a commercial space for your business. Our team of experts is dedicated to providing you with exceptional service and guidance throughout your property search and beyond.
    
    We invite you to explore our listings, schedule viewings, and take advantage of our property comparison and mortgage calculator tools to make informed decisions. Our goal is to make your property search as seamless and enjoyable as possible.
    
    Thank you for choosing ProPulse Real Estate. We look forward to assisting you in finding your ideal property.
    
    Best regards,
    The ProPulse Real Estate Team
    `,
      html: `<p>Dear ${name},</p>
    <p>We are delighted to welcome you to ProPulse Real Estate! Your journey to finding the perfect property starts here.</p>
    <p>At ProPulse Real Estate, we are committed to helping you find your dream property, whether it's a cozy home, a spacious apartment, or a commercial space for your business. Our team of experts is dedicated to providing you with exceptional service and guidance throughout your property search and beyond.</p>
    <p>We invite you to explore our listings, schedule viewings, and take advantage of our property comparison and mortgage calculator tools to make informed decisions. Our goal is to make your property search as seamless and enjoyable as possible.</p>
    <p>Thank you for choosing ProPulse Real Estate. We look forward to assisting you in finding your ideal property.</p>
    <p>Best regards,<br>The ProPulse Real Estate Team</p>
    `,
    });

    console.log(`Message Id ${info.messageId}`);
    return "Successfully sent email";
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }
};

// Endpoint for handling Login submissions
app.post("/login", async (req, res) => {
  try {
    console.log("Login request received");
    console.log("Request Body:", req.body);

    const user = await models.User.findOne({ name: req.body.name });

    if (user) {
      console.log("User found:", user);

      if (user.password === req.body.password) {
        console.log("Login successful");
        res.status(200).send("Login Successfully");
      } else {
        console.log("Wrong password");
        res.status(401).send("Wrong password");
      }
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(`Error ${error.message}`);
    res.status(500).send("Error logging in");
  }
});

const start = () => {
  app.listen(port, () => {
    console.log("Server is connected");
  });
};

start();
