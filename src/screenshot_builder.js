/**
 * @fileoverview Handles the screenshot logic of the bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const fs = require("fs");
const Nightmare = require("nightmare");
const plugin = require("nightmare-screenshot");
const config = require("../config");
const lib = require("./lib");

/**
 * Takes a screenshot of an item tooltip on the classicdb website, and saves
 * it to the disk. The image is saved as `img/${item_id}.png`. Function is sync
 * so the image can be accessed immediately after running.
 *
 * @param {number} item_id - ID of the item to build an image from.
 */
function build_item_images(item_id) {
    let tooltip_path = `${config.output_dir}/${config.tooltip_cache_dir}/${item_id}.png`;
    let thumbnail_path = `${config.output_dir}/${config.thumbnail_cache_dir}/${item_id}.png`;
    lib.on_debug(`Buidling images for item ${item_id}`);
    // Check if tooltip file already exists.
    if (!fs.existsSync(tooltip_path)) {
        lib.on_debug(`Building ${tooltip_path}`);
        let html_selector = `div[id=tooltip${item_id}-generic]`;
        new Nightmare()
            .viewport(2000, 2000)
            .goto(`https://classicdb.ch/?item=${item_id}`)
            .use(plugin.screenshotSelector(tooltip_path, html_selector, lib.on_error))
            .run(() => lib.on_debug(`Wrote thumbnail for ${item_id}`));
    }    // Check if thumbnail file already exists.
    if (!fs.existsSync(thumbnail_path)) {
        lib.on_debug(`Building ${thumbnail_path}`);
        let html_selector = `div[id=icon${item_id}-generic]`;
        new Nightmare()
            .viewport(2000, 2000)
            .goto(`https://classicdb.ch/?item=${item_id}`)
            .use(plugin.screenshotSelector(thumbnail_path, html_selector, lib.on_error))
            .run(() => lib.on_debug(`Wrote thumbnail for ${item_id}`));
    }
}

module.exports = {
    build_item_images: build_item_images
};