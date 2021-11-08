const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/avi": "avi",
  "video/mkv": "mkv",
  "video/png": "webm",
};

let storage = null;
try {
  storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "mediaPostsStore");
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_").split(".")[0];
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + "." + extension);
    },
  });
} catch (err) {
  console.log({
    error: "Invalid request!",
    err: err,
  });
}

module.exports = multer({ storage }).single("mediaFile");
