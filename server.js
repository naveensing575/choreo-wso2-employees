require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Fetch Users and Todos from JSONPlaceholder
app.get("/employees", async (req, res) => {
  try {
    const [usersResponse, todosResponse] = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/users"),
      axios.get("https://jsonplaceholder.typicode.com/todos"),
    ]);

    const users = usersResponse.data;
    const todos = todosResponse.data;

    // Merge users with their respective todos
    const integratedData = users.map((user) => ({
      ...user,
      todos: todos.filter((todo) => todo.userId === user.id),
    }));

    res.json(integratedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
