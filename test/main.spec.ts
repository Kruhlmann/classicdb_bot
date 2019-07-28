/**
 * @fileoverview Unit tests
 * @author Andreas Kruhlmann
 */
import * as assert from "assert";
import "chai";
import { Client, Guild, Permissions, RichEmbed, TextChannel } from "discord.js";
import * as fs from "fs";

import { create_client, find_channel } from "./client";
// import { Processor } from "./processor";

// jasmine-ts doesn't easily allow for compileroptions such as
// --resolveJsonModule, so the config file is read as a file and parsed as JSON.
const config_path = `${__dirname}/../config.json`;
const config = JSON.parse(fs.readFileSync(config_path, "utf8"));
const random_number = Math.random();
// const reporter = new SpecReporter({ customProcessors: [Processor] });

const reports_id = config.unit_test_channels.reports;
const category_id = config.unit_test_channels.category;

let test_channel: TextChannel;
let reports_channel: TextChannel;
let client: Client;
let guild: Guild;

const create_text_channel = async (g: Guild, name: string) =>
    await g.createChannel(name, "text") as TextChannel;

describe("Discord bot", () => {
    before(async () => {
        client = await create_client();

        reports_channel = find_channel(client, reports_id) as TextChannel;
        guild = reports_channel.guild;
        test_channel = await create_text_channel(guild, `${random_number}`);

        await test_channel.setParent(category_id);
    });

    it("should do basic arithmetic", () => {
        assert.strictEqual(2 + 2, 4);
    });

    it("should launch bot", () => {
        assert.ok(client);
    });

    it("should find guild", () => {
        assert.ok(guild);
    });

    it("should find unit test channel", () => {
        assert.ok(test_channel);
    });

    it("should find unit reports channel", () => {
        assert.ok(reports_channel);
    });

    it("should have permission to delete channels", (done) => {
        const permissions = test_channel.permissionsFor(client.user);
        permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
        done();
    });

    it("should send and recieve a message", async () => {
        await test_channel.send(random_number);
        const messages = (await test_channel.fetchMessages()).array();
        return new Promise((resolve, reject) => {
            messages.forEach((message) => {
                if (message.content === `${random_number}`) {
                    resolve();
                }
            });
            reject();
        });
    });

    // it("should remove the production bot from the channel", async () => {
    //     test_channel.overwritePermissions()
    // });

    // it("should request an item correctly", async () => {
    //     await test_channel.send("[thunderfury]");
    //     const messages = (await test_channel.fetchMessages()).array();
    //     return new Promise((resolve, reject) => {
    //         messages.forEach((message) => {
    //             console.log(message.content);
    //         });
    //         resolve();
    //         reject();
    //         // reject();
    //     });
    // });

    after(async () => {
        await test_channel.delete();
        // const date = moment().format("MMM Do YYYY HH:MM");
        // const total_specs = Processor.specs_passed + Processor.specs_failed;

        // const succeeded = total_specs - Processor.specs_passed < 1;
        // const color = succeeded
        //     ? "#00FF00"
        //     : "#FF0000";
        // const description = `**${total_specs}** Specs\n`
        //     + `**${Processor.specs_passed}** Passes\n`
        //     + `**${Processor.specs_failed}** Failures`;

        // const success_message = new RichEmbed()
        //     .setTitle(`Results for test @ ${date}`)
        //     .setDescription(description)
        //     .setColor(color);
        // await reports_channel.send({embed: success_message});
        // setTimeout(() => {
        //     process.exit(succeeded ? 0 : 1);
        // }, 2000);
    });

});
