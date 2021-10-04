const express = require("express");
const app = express();
const fs = require("fs");

app.get("/" , function(req,res) {
    res.sendFile(__dirname + "/index.html");
})

app.get("/video" , function(req,res) {
    const range = req.headers.range;
    if(!range) {
        console.log("no range")
    }
    const videopath = "bigbuck.mp4";
    const videosize = fs.statSync(videopath).size;

    const chunkSize = 10 ** 6 //1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize ,videosize -1);

    const conetent_length = end - start + 1;

    const headers = {
        "content-range" : `bytes ${start} - ${end} /${videosize}`,
        "accept-range": "bytes",
        "content-length" : conetent_length,
        "content-type" : "video/MP4"
    };

     res.writeHead(206 ,headers);

     const videoStream = fs.createReadStream(videopath, {start , end});

     videoStream.pipe(res)

    //
})

app.listen(8000, function() {
    console.log("server is running on 8000")
})