(()=>{"use strict";var e={492:function(e,t,r){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(r(860)),s=n(r(185)),a=n(r(0)),o=r(940),l=n(r(347)),d=n(r(567)),u=n(r(986)),f=n(r(738)),p=n(r(17)),m=n(r(470)),g=r(206),c=(0,i.default)();r(142).config();const x=s.default.createConnection(process.env.MONGOURL||"");var v,_;c.set("views",p.default.resolve(p.default.dirname(__dirname),"views")),c.set("view engine","ejs"),c.use(i.default.static(__dirname+"public")),c.use(u.default.json()),c.use(u.default.urlencoded({extended:!0})),c.use((0,d.default)("_method")),c.use((0,m.default)("tiny")),x.once("open",(()=>{(v=(0,a.default)(x.db,s.default.mongo)).collection("files"),_=new s.default.mongo.GridFSBucket(x.db,{bucketName:"files"})}));const q=new o.GridFsStorage({url:process.env.MONGOURL||"",file:(e,t)=>new Promise(((e,r)=>{l.default.randomBytes(16,((r,n)=>{const i=n.toString("hex")+p.default.extname(t.originalname);e({filename:i,bucketName:"files"})}))}))}),y=(0,f.default)({storage:q});c.post("/upload",y.single("file"),((e,t)=>{t.redirect("/")})),c.get("/",((e,t)=>{v.files.find().toArray(((e,r)=>{r&&0!==r.length?(r.map((e=>{"image/png"===e.contentType||"image/jpeg"===e.contentType?e.isImage=!0:e.isImage=!1})),t.render("index",{files:r})):t.render("index",{files:!1})}))})),c.get("/files",((e,t)=>{v.files.find().toArray(((e,r)=>{if(e)return t.status(404).send(e);t.status(200).send(r)}))})),c.get("/files/:filename",((e,t)=>{v.files.findOne({filename:e.params.filename},((e,r)=>{if(e)return t.status(400).send(e);t.status(200).json(r)}))})),c.get("/image/:image",((e,t)=>{v.files.findOne({filename:e.params.image},((e,r)=>{e&&t.status(404).send(e),!r||"image/png"!==r.contentType&&"image/jpeg"!==r.contentType?t.send("not a image"):_.openDownloadStream(r._id).pipe(t)}))})),c.get("/download/:filename",((e,t)=>{v.files.findOne({filename:e.params.filename},((e,r)=>{r&&_.openDownloadStream(r._id).pipe(t)}))})),c.get("/del/:filename",((e,t)=>{v.files.findOneAndDelete({filename:e.params.filename},((e,r)=>{if(e)return t.status(400).send(e);t.redirect("/")}))})),c.listen(process.env.PORT||4e3,(()=>(0,g.log)("Working")))},986:e=>{e.exports=require("body-parser")},347:e=>{e.exports=require("crypto")},142:e=>{e.exports=require("dotenv")},860:e=>{e.exports=require("express")},0:e=>{e.exports=require("gridfs-stream")},567:e=>{e.exports=require("method-override")},185:e=>{e.exports=require("mongoose")},470:e=>{e.exports=require("morgan")},738:e=>{e.exports=require("multer")},940:e=>{e.exports=require("multer-gridfs-storage")},206:e=>{e.exports=require("console")},17:e=>{e.exports=require("path")}},t={};!function r(n){var i=t[n];if(void 0!==i)return i.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}(492)})();