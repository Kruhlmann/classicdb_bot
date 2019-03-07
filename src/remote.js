/**
 * @fileoverview Handles HTTP functionality.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */
const request = require("request-promise");
const config = require("../config");
const fs = require("fs");
const lib = require("./lib");

const host = config.upload_uri_stub;

async function upload_item_images(item_id) {
    let tooltip_path = `${config.output_dir}/${config.tooltip_cache_dir}/${item_id}.png`;
    let thumbnail_path = `${config.output_dir}/${config.thumbnail_cache_dir}/${item_id}.png`;
    await upload(item_id, "png", "thumbnail", thumbnail_path);
    await upload(item_id, "png", "tooltip", tooltip_path);
}

function upload(item_id, ext, type, file_path) {
    const options = {
        formData: {
            file: fs.createReadStream(file_path)
        },
        method: "POST",
        uri: `${host}?item_id=${item_id}&extension=${ext}&type=${type}`,
    };
    return request(options).then(() => {
        lib.on_debug("Upload succeeded");
    }).catch(error => {
        lib.on_error(error);
    });
}

module.exports = {
    upload_item_images
};
