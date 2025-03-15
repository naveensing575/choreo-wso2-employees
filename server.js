require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const BASE_URL = "https://jsonplaceholder.typicode.com";

// 1️⃣ Get all users
app.get("/employees/users", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// 2️⃣ Get all todos
app.get("/employees/todos", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/todos`);
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
});

// 3️⃣ Get user details and todos by userId
app.get("/employees/user-todos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user and todos in parallel
    const [userResponse, todosResponse] = await Promise.all([
      axios.get(`${BASE_URL}/users/${userId}`),
      axios.get(`${BASE_URL}/todos?userId=${userId}`),
    ]);

    // Merge user data with todos
    const integratedData = {
      ...userResponse.data,
      todos: todosResponse.data,
    };

    res.json(integratedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user todos", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
