const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const contactsRoutes = require("./routes/contacts.routes");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ extended: false }));

// Define Routes
app.get("/api", (req, res) => res.json({ msg: "I'm alive" }));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
