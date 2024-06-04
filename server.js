const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Cookie session configuration
app.use(
  cookieSession({
    name: "manideep-session",
    keys: [process.env.COOKIE_SECRET], // should use a secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");

// MongoDB connection
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to manideep application." });
});

// routes
require("./app/routes/auth.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

