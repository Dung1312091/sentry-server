const express = require("express"),
    multer = require("multer"),
    bodyParser = require("body-parser"),
    path = require("path"),
    fs = require("fs"),
    miniDumpsPath = path.join(__dirname, "app-crashes");
var cors = require("cors");
const app = express();
// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// parse application/json
app.use(bodyParser.json());
app.use(cors());
let upload = multer({
    dest: miniDumpsPath
}).single("upload_file_minidump");
app.get("/", (req, res) => {
    res.send("Hello");
});

app.use(
    "/build",
    function (req, res, next) {
        console.log("req=====>", req);
        next();
    },
    express.static("build")
);

app.post("/crash-report", upload, (req, res) => {
    req.body.filename = req.file.filename;
    const crashData = JSON.stringify(req.body);
    fs.writeFile(req.file.path + ".json", crashData, e => {
        if (e) {
            return console.error("Cant write: " + e.message);
        }
        console.info("crash written to file:\n\t" + crashData);
    });
    res.end();
});
app.post("/bugs", (req, res) => {
    console.log("====>", req.body);
    res.json({});
});
app.get("/source-map:path", (req, res) => {
    console.log("====>", req.params);
    res.json({});
});

app.listen(process.env.PORT || 3001, () => {
    console.log("running on port 3001");
});