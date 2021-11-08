import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

app.listen(4000, () =>
  console.log(`Server listening on port http://localhost:${PORT}`)
);
