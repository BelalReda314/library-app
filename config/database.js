const { default: mongoose } = require("mongoose");

const dbConnect = (uri) => {
  try {
    mongoose
      .connect(uri, {
        dbName: "books",
      })
      .then(() => {
        console.log(`Connected to Database success`);
      })
      .catch(() => {
        console.error("Error connecting to db");
      });
  } catch (error) {
    console.error("Error connecting to db");
    process.exit(1);
  }
};
module.exports = dbConnect;