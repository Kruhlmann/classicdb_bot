import { Main } from "./main";

export class DevelopmentMain extends Main {
    public async main(): Promise<void> {
        return this.bot.start();
    }
}
