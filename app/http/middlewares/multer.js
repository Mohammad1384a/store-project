const multer = require("multer");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");

function createRoute() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  const directory = path.join(
    __dirname,
    "../../../public/uploads/blogs",
    year,
    month,
    day
  );
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = createRoute();
    req.fileName = file;
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const validTypes = [".jpeg", ".jpg", ".png"];
    if (!validTypes.includes(ext)) {
      cb(createError.BadRequest("invalid file type"), null);
    }
    const fileName = (new Date().getTime() + ext).toString();
    cb(null, fileName);
  },
});
const maxSize = 0.5 * 1000 * 1000;
const uploadFile = multer({ storage: storage, limits: { fileSize: maxSize } });
module.exports = {
  uploadFile,
};
