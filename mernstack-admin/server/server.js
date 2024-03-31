require("dotenv").config();
const express = require("express");
const app = express();
const authroute = require("./router/auth-router");
const contactroute = require("./router/contact-router")
const serviceroute = require("./router/service-router")
const adminroute = require("./router/admin-router");
const connectDb = require("./utils/db");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");

// let's tackle cors
const corsOptions = {
  origin:"http://localhost:3000",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials:true,
}



app.use(cors(corsOptions));


// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use(express.json());

app.use("/api/auth", authroute);
app.use("/api/form",contactroute)
app.use("/api/data",serviceroute)
app.use("/api/admin",adminroute)

app.use(errorMiddleware)

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});