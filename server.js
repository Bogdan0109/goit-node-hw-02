require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);

    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main();
