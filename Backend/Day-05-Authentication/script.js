import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
await connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
