const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://moinwkhan21:realestate@cluster0.3ipefli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// Schema for users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


// Define models
const User = mongoose.model("User", userSchema);

module.exports = { User };
