require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRoutes = require("./routes/UserRoute");

mongoose.connect(process.env.DB).then(() => {
  console.log("CONNECTED TO DB");
});

app.use(express.json());

app.use("/api", userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
