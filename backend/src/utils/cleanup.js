const fs = require("fs");

module.exports.deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log("Cleanup failed", err);
  }
};
