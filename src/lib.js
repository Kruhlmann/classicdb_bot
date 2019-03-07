/**
 * @fileoverview Project wide functions.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */
const sentry = require("@sentry/node");
const config = require("../config");

// Init error reporting.
sentry.init({dsn: config.sentry_dsn});

/**
 * Simple generic error handling.
 *
 * @param {Error|string} error - Error occurred.
 */
function on_error (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    // Don't spam sentry during development.
    if (config.deployment_mode === "production") {
        sentry.captureException(error);
    }
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