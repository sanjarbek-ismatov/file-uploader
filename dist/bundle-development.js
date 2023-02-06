/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nconst mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ \"mongoose\"));\r\nconst gridfs_stream_1 = __importDefault(__webpack_require__(/*! gridfs-stream */ \"gridfs-stream\"));\r\nconst multer_gridfs_storage_1 = __webpack_require__(/*! multer-gridfs-storage */ \"multer-gridfs-storage\");\r\nconst crypto_1 = __importDefault(__webpack_require__(/*! crypto */ \"crypto\"));\r\nconst method_override_1 = __importDefault(__webpack_require__(/*! method-override */ \"method-override\"));\r\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\r\nconst multer_1 = __importDefault(__webpack_require__(/*! multer */ \"multer\"));\r\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nconst morgan_1 = __importDefault(__webpack_require__(/*! morgan */ \"morgan\"));\r\nconst console_1 = __webpack_require__(/*! console */ \"console\");\r\nconst app = (0, express_1.default)();\r\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\r\nconst connect = mongoose_1.default.createConnection(process.env.MONGOURL || \"\");\r\napp.set(\"views\", path_1.default.resolve(path_1.default.dirname(__dirname), \"views\"));\r\napp.set(\"view engine\", \"ejs\");\r\napp.use(express_1.default.static(__dirname + \"public\"));\r\napp.use(body_parser_1.default.json());\r\napp.use(body_parser_1.default.urlencoded({ extended: true }));\r\napp.use((0, method_override_1.default)(\"_method\"));\r\napp.use((0, morgan_1.default)(\"tiny\"));\r\nvar gfs, gfsb;\r\nconnect.once(\"open\", () => {\r\n    gfs = (0, gridfs_stream_1.default)(connect.db, mongoose_1.default.mongo);\r\n    gfs.collection(\"files\");\r\n    gfsb = new mongoose_1.default.mongo.GridFSBucket(connect.db, {\r\n        bucketName: \"files\",\r\n    });\r\n});\r\n/**\r\n * MongoDB storage\r\n */\r\nconst storage = new multer_gridfs_storage_1.GridFsStorage({\r\n    url: process.env.MONGOURL || \"\",\r\n    file: (req, file) => {\r\n        return new Promise((resolve, reject) => {\r\n            crypto_1.default.randomBytes(16, (err, buffer) => {\r\n                const filename = buffer.toString(\"hex\") + path_1.default.extname(file.originalname);\r\n                const fileInfo = {\r\n                    filename,\r\n                    bucketName: \"files\",\r\n                };\r\n                resolve(fileInfo);\r\n            });\r\n        });\r\n    },\r\n});\r\n/**\r\n * Disk storage\r\n */\r\n// const diskStorage = multer.diskStorage({\r\n//   destination: (req, file, cb) => cb(null, \"./public\"),\r\n//   filename: (req, file, cb) => {\r\n//     const filename =\r\n//       Date.now() +\r\n//       Math.round(Math.random() * 1e16) +\r\n//       path.extname(file.originalname);\r\n//     cb(null, filename);\r\n//   },\r\n// });\r\nconst upload = (0, multer_1.default)({ storage });\r\napp.post(\"/upload\", upload.single(\"file\"), (req, res) => {\r\n    res.redirect(\"/\");\r\n});\r\napp.get(\"/\", (req, res) => {\r\n    gfs.files.find().toArray((err, files) => {\r\n        if (!files || files.length === 0) {\r\n            res.render(\"index\", { files: false });\r\n        }\r\n        else {\r\n            files.map((file) => {\r\n                if (file.contentType === \"image/png\" ||\r\n                    file.contentType === \"image/jpeg\") {\r\n                    file.isImage = true;\r\n                }\r\n                else {\r\n                    file.isImage = false;\r\n                }\r\n            });\r\n            res.render(\"index\", { files });\r\n        }\r\n    });\r\n});\r\napp.get(\"/files\", (req, res) => {\r\n    gfs.files.find().toArray((err, file) => {\r\n        if (err)\r\n            return res.status(404).send(err);\r\n        res.status(200).send(file);\r\n    });\r\n});\r\napp.get(\"/files/:filename\", (req, res) => {\r\n    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {\r\n        if (err)\r\n            return res.status(400).send(err);\r\n        res.status(200).json(file);\r\n    });\r\n});\r\napp.get(\"/image/:image\", (req, res) => {\r\n    gfs.files.findOne({ filename: req.params.image }, (err, file) => {\r\n        if (err)\r\n            res.status(404).send(err);\r\n        if (file &&\r\n            (file.contentType === \"image/png\" || file.contentType === \"image/jpeg\")) {\r\n            const readStream = gfsb.openDownloadStream(file._id);\r\n            readStream.pipe(res);\r\n        }\r\n        else {\r\n            res.send(\"not a image\");\r\n        }\r\n    });\r\n});\r\napp.get(\"/download/:filename\", (req, res) => {\r\n    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {\r\n        if (file) {\r\n            const readStream = gfsb.openDownloadStream(file._id);\r\n            readStream.pipe(res);\r\n        }\r\n    });\r\n});\r\napp.get(\"/del/:filename\", (req, res) => {\r\n    gfs.files.findOneAndDelete({ filename: req.params.filename }, (err, file) => {\r\n        if (err)\r\n            return res.status(400).send(err);\r\n        res.redirect(\"/\");\r\n    });\r\n});\r\napp.listen(process.env.PORT || 4000, () => (0, console_1.log)(\"Working\"));\r\n\n\n//# sourceURL=webpack://file-uploader/./index.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "gridfs-stream":
/*!********************************!*\
  !*** external "gridfs-stream" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("gridfs-stream");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("method-override");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "multer-gridfs-storage":
/*!****************************************!*\
  !*** external "multer-gridfs-storage" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("multer-gridfs-storage");

/***/ }),

/***/ "console":
/*!**************************!*\
  !*** external "console" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("console");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ })()
;