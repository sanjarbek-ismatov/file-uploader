const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const morgan = require("morgan");
const { log } = require("console");
const app = express();
require("dotenv").config();

const connect = mongoose.createConnection(process.env.MONGOURL);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

var gfs, gfsb;
connect.once("open", () => {
  gfs = Grid(connect.db, mongoose.mongo);
  gfs.collection("files");
  gfsb = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "files",
  });
});
const storage = new GridFsStorage({
  url: process.env.MONGOURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) return reject(err);
        const filename = buff.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "files",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});
app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/png" ||
          file.contentType === "image/jpeg"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });

      res.render("index", { files: files });
    }
  });
});
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, file) => {
    if (err) return res.status(404).send(err);
    res.status(200).send(file);
  });
});
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(file);
  });
});
app.get("/image/:image", (req, res) => {
  gfs.files.findOne({ filename: req.params.image }, (err, file) => {
    if (file.contentType === "image/png" || file.contentType === "image/jpeg") {
      const readStream = gfsb.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.send("not a image");
    }
  });
});
app.get("/download/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    const readStream = gfsb.openDownloadStream(file._id);
    readStream.pipe(res);
  });
});
app.get("/del/:filename", (req, res) => {
  gfs.files.findOneAndDelete({ filename: req.params.filename }, (err, file) => {
    if (err) return res.status(400).send(err);
    res.redirect("/");
  });
});
app.listen(process.env.PORT || 4000, () => log("Working"));
