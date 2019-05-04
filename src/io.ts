/**
 * @fileoverview Handles application input and output.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as config from "../config.json";

/**
 * Handles errors. During production will alert sentry about the occurrence of
 * the error. Otherwise it will be appended to the log file.
 *
 * @param error - Error to report.
 */
export function handle_exception(error: Error | string) {
    if (typeof error === "string") {
        error = new Error(error);
    }
    if (config.deployment_mode === "production") {
        sentry.captureException(error);
    } else {
        log("Exception caught:");
        log(`${error.stack}`);
    }
}

/**
 * Logs a message.
 *
 * @param message - Message to log.
 */
export function log(message: string) {
    /* tslint:disable-next-line:no-console */
    console.log(message);
}
