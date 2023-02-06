import express from "express";
import mongoose from "mongoose";
import Grid, { Grid as GridType } from "gridfs-stream";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import morgan from "morgan";
import { log } from "console";
import { GridFSBucket } from "mongodb";
const app = express();

require("dotenv").config();

const connect = mongoose.createConnection(process.env.MONGOURL || "");
app.set("views", path.resolve(path.dirname(__dirname), "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

var gfs: GridType, gfsb: GridFSBucket;
connect.once("open", () => {
  gfs = Grid(connect.db, mongoose.mongo);
  gfs.collection("files");
  gfsb = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "files",
  });
});

/**
 * MongoDB storage
 */
const storage = new GridFsStorage({
  url: process.env.MONGOURL || "",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buffer) => {
        const filename =
          buffer.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: "files",
        };
        resolve(fileInfo);
      });
    });
  },
});
/**
 * Disk storage
 */
// const diskStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./public"),
//   filename: (req, file, cb) => {
//     const filename =
//       Date.now() +
//       Math.round(Math.random() * 1e16) +
//       path.extname(file.originalname);
//     cb(null, filename);
//   },
// });
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

      res.render("index", { files });
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
    if (err) res.status(404).send(err);

    if (
      file &&
      (file.contentType === "image/png" || file.contentType === "image/jpeg")
    ) {
      const readStream = gfsb.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.send("not a image");
    }
  });
});
app.get("/download/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (file) {
      const readStream = gfsb.openDownloadStream(file._id);
      readStream.pipe(res);
    }
  });
});
app.get("/del/:filename", (req, res) => {
  gfs.files.findOneAndDelete({ filename: req.params.filename }, (err, file) => {
    if (err) return res.status(400).send(err);
    res.redirect("/");
  });
});
app.listen(process.env.PORT || 4000, () => log("Working"));
