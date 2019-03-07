/**
 * @fileoverview Simple image upload server for classicdb_bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */
const multer = require("multer");
const express = require("express");

const _PORT = 3001;
const _UPLOAD_DIRECTORY = "/var/www/static_http/classicdb_bot/";
const server = express();
const router = express.Router();

const folders = {
    "tooltip": "tooltip_cache/",
    "thumbnail": "thumbnail_cache/",
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const q = req.query;
        cb(null, `${_UPLOAD_DIRECTORY}${folders[q.type]}`);
    },
    filename: (req, file, cb) => {
        const q = req.query;
        console.log(q)
        if (!q.item_id
            || !q.extension
            || !q.type
            || !Object.keys(folders).includes(q.type)) {
            return cb("Bad Request");
        }
        console.log(`Wrote ${_UPLOAD_DIRECTORY}${folders[q.type]}${q.item_id}.${q.extension}`);
        cb(null, `${q.item_id}.${q.extension}`);
    }
});
storage = multer({storage: storage});

router.post("/upload", storage.single("file"), (req, res) => {
    res.sendStatus(200).end();
});

server.use(router).listen(_PORT, () => {
    console.log(`Listening on localhost:${_PORT}\n\t${_UPLOAD_DIRECTORY}`);
});