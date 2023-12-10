const multer = require("multer");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");

function createRoute(field) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  const directory = path.join(
    __dirname,
    `../../../public/uploads/${field}`,
    year,
    month,
    day
  );
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname;
    const filePath =
      type === "image"
        ? createRoute("blogs")
        : type === "images"
        ? createRoute("products")
        : createRoute("videos");
    req.fileName = file;
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const type = file.fieldname;
    const validTypes =
      type === "image" || type === "images"
        ? [".jpeg", ".jpg", ".png"]
        : [".mp4", ".mkv", ".mov", "mpg", "mpeg"];
    if (!validTypes.includes(ext)) {
      cb(createError.BadRequest("invalid file type"), null);
    }
    const fileName = (new Date().getTime() + ext).toString();
    cb(null, fileName);
  },
});

const maxSize = 25 * 1000 * 1000;
const videoSize = 300 * 1000 * 1000;

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize, fieldSize: maxSize },
});
const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: videoSize, fieldSize: videoSize },
});

module.exports = {
  uploadFile,
  uploadVideo,
};
