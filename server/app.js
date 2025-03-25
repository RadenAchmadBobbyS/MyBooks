const express = require("express");
const passport = require("passport");
const { sequelize } = require("./models");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const protected = require("./routes/protected");
const bookShelf = require("./routes/bookShelf");

const app = express();
app.use(express.json());
app.use(passport.initialize());

// ✅ Gunakan Routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/bookshelves", bookShelf)
app.use("/", protected)

// ✅ Start Server
const PORT = 3000
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});