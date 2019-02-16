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
 * Screenshots a DOM element on a website and saves it to the disk.
 *
 * @param {string} url - URL to access.
 * @param {string} selector - HTML selector for the desired element.
 * @param {string} path - Local output path with filename and extension.
 */
function screenshot_dom_element(url, selector, path) {
    lib.on_debug(`Building ${path}`);
    try {
        new Nightmare({show: true})
            .viewport(2000, 2000)
            .goto(url)
            .use(plugin.screenshotSelector(path, selector))
            .run();
    }catch (error) {
        //TODO:ask:FEB-16-2019: This fails even if the image is generated.

    }
}

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
    let url = `https://classicdb.ch/?item=${item_id}`;
    lib.on_debug(`Buidling images for item ${item_id}`);

    if (!fs.existsSync(tooltip_path)) {
        screenshot_dom_element(
            url,
            `div[id=tooltip${item_id}-generic]`,
            tooltip_path
        );
    }

    if (!fs.existsSync(thumbnail_path)) {
        screenshot_dom_element(
            url,
            `div[id=icon${item_id}-generic]`,
            thumbnail_path
        );
    }
}

module.exports = {
    build_item_images: build_item_images
};