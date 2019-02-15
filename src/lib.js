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
    console.log(error);
}

module.exports = {
    on_error: on_error
};