import { AlreadyStartedError } from "../error/already_started";
import { Startable } from "./startable";

export class SingleInstanceStartable implements Startable {
    protected has_started = false;

    public async start(): Promise<void> {
        if (this.has_started) {
            throw new AlreadyStartedError();
        }
        this.has_started = true;
    }
}
