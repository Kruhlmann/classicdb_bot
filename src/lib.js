/**
 * @fileoverview Project wide functions.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

/**
 * Simple generic error handling.
 *
 * @param {Error|string} error - Error occurred.
 */
function on_error (error) {
    // eslint-disable-next-line no-console
    console.error(error);
}

/**
 * Simple debugger.
 *
 * @param {string} message - Message.
 */
function on_debug (message) {
    // eslint-disable-next-line no-console
    console.log(message);
}

module.exports = {
    on_error: on_error,
    on_debug: on_debug
};