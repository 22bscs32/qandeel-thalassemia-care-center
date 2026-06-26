const mongoose = require("mongoose");

const uri =
  "mongodb://ac-frckyir-shard-00-00.ipepjpt.mongodb.net:27017,ac-frckyir-shard-00-01.ipepjpt.mongodb.net:27017,ac-frckyir-shard-00-02.ipepjpt.mongodb.net:27017/qandeel?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(err));