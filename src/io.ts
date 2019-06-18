/**
 * @fileoverview Handles application input and output.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as config from "../config.json";
import { LoggingLevel } from "./typings/types.js";

// Used for outputting formatted logs.
const logging_formats = {
    [LoggingLevel.DEV]: (msg: string, time: string) => {
        return `\x1b[32m[DEV] [${time}] ${msg}\x1b[0m`;
    },
    [LoggingLevel.INF]: (msg: string, time: string) => {
        return `\x1b[37m[INF] [${time}] ${msg}\x1b[0m`;
    },
    [LoggingLevel.WAR]: (msg: string, time: string) => {
        return `\x1b[33m[WAR] [${time}] ${msg}\x1b[0m`;
    },
    [LoggingLevel.ERR]: (msg: string, time: string) => {
        return `\x1b[31m[ERR] [${time}] ${msg}\x1b[0m`;
    },
};

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
        log("Exception caught:", LoggingLevel.ERR);
        log(`${error.stack}`, LoggingLevel.ERR);
    }
}

/**
 * Logs a message.
 *
 * @param message - Message to log.
 */
export function log(message: string, level: LoggingLevel = LoggingLevel.INF) {
    if (config.deployment_mode === "production" && level === LoggingLevel.DEV) {
        return;
    }
    const now = new Date().toLocaleString(config.locale || "en-GB", {
        timeZone: config.time_zone || "UTC",
    });
    // tslint:disable-next-line: no-console
    console.log(logging_formats[level](message, now));
}
