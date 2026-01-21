const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./db");
const entriesRouter = require("./routes/entries");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/entries", entriesRouter);

const port = process.env.PORT || 3000;

connectDb(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
