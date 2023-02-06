if (process.env.NODE_ENV === "production") {
  require("./dist/bundle-production");
} else {
  require("./dist/bundle-development");
}
