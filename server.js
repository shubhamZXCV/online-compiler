const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
var cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
const port = 3000;
const hostname = "127.0.0.1";

let e = "";
let o = "";

app.use(cors())

app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { error: e, output: o });
});

app.post("/compile", (req, res) => {
  console.log("compiling..")
  let code = req.body.code;
  fs.writeFileSync("main.c", code);

  // Reset error and output
  e = "";
  o = "";

  exec("gcc main.c -o main", (error, stdout, stderr) => {
    if (error) {
      e = stderr;
      res.redirect("/");
    } else {
      exec("./main", (error, stdout, stderr) => {
        if (error) {
          e = stderr;
        } else {
          o = stdout;
        }
        res.redirect("/");
      });
    }
  });
});

app.listen(port, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
