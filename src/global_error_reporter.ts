import * as Sentry from "@sentry/node";

export interface IGlobalErrorReporter {
    initialize(): void;
}

export class SentryGlobalErrorReporter implements IGlobalErrorReporter {
    private key: string;
    private trace_sample_rate: number;

    public constructor(key: string, traces_sample_rate: number) {
        this.key = key;
        this.trace_sample_rate = traces_sample_rate;
    }
    public initialize(): void {
        Sentry.init({ dsn: this.key, tracesSampleRate: this.trace_sample_rate });
    }
}
