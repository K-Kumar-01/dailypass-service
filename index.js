const express = require("express");
const dailyPassRoutes = require("./routes/dailyPass");
const { errorHandler, NotFoundError, connectDB } = require("prattask-cmmn");

const app = express();

// const DB_STRING = "mongodb://mongo-dailypass:27017/dailypass";
// const DB_STRING = "mongodb://127.0.0.1:27017/dailypass";
const DB_STRING = "mongodb+srv://kushal:pratilipi@cluster0.1la3i.mongodb.net/dailyPass?retryWrites=true&w=majority";

connectDB(DB_STRING);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/dailyPass", dailyPassRoutes);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
