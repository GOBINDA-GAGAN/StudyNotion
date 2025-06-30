const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = (MONGODB_URL) => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully 🟢"))
    .catch((error) => {
        console.log("DB Connection Failed 🔴");
        console.error(error);
        process.exit(1);
    });
};

module.exports = dbConnection;
