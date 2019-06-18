import { DisplayProcessor } from "jasmine-spec-reporter";

interface CustomReporterResult extends jasmine.CustomReporterResult {
    duration?: string;
}

export class Processor extends DisplayProcessor {
    public static specs_passed = 0;
    public static specs_failed = 0;

    public displaySuccessfulSpec(s: CustomReporterResult, log: string): string {
        Processor.specs_passed ++;
        return super.displaySuccessfulSpec(s, log);
    }

    public displayFailedSpec(s: CustomReporterResult, log: string): string {
        Processor.specs_failed ++;
        return super.displayFailedSpec(s, log);
    }
}
