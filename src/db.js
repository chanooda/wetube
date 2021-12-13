import mongoose from "mongoose";

console.log(process.env.DB_URL);
mongoose.connect(process.env.DB_URL, {
  dbName,
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB!!!");

db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
