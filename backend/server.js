require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimiter = require("./middleware/rateLimiter");

require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/chat", require("./routes/chat"));
app.use("/api/sessions", require("./routes/sessions"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
