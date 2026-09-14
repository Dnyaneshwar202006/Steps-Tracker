import dotenv from "dotenv";
import app from "./app";
import db from "./db/db";

dotenv.config();

const port = process.env.PORT || 5001;

app.listen(port, async () => {
  console.log(`Server running on the port ${port}`);

  try {
    await db.execute("SELECT 1");
    console.log("Database Connected Successfully!");
  } catch (err) {
    console.error("Db Connection failed: ", err);
  }
});
