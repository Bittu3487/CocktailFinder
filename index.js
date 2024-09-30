import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url'; // Import to resolve __dirname
import env from "dotenv";

const app = express();
const port = 3000;
env.config()
const API_URL = process.env.API_URL;
// Resolve __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set views directory

// Serve static files if necessary
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response" });
});

app.post("/submit", async (req, res) => {
  const drinksName = req.body["fName"]; // Get form input
  try {
    const response = await axios.get(`${API_URL}.php?s=${drinksName}`);
    const result = response.data; // Axios response data
    // Check if result has drinks
    if (result && result.drinks) {
      res.render("index.ejs", { data: result }); // Pass result to EJS
    } else {
      res.render("index.ejs", { data: null }); // Handle no drinks found
    }
  } catch (error) {
    res.status(500).send(error.message); // Error handling
  }
});

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
