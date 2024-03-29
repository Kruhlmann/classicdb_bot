# Classic DB discord bot

[![Discord Server](https://img.shields.io/discord/572880907682447380%20.svg?logo=discord&style=for-the-badge)](https://discord.gg/Y5eA3dW)
[![CII Best Practices](https://img.shields.io/cii/percentage/2579.svg?label=CII%20Best%20Practices&style=for-the-badge)](https://bestpractices.coreinfrastructure.org/projects/2579)

## Setup

<p align="center">
  <a href="https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=2147534848">
    <img src="doc/connect.png" />
  </a>
</p>

To invite the bot click [this link](https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=0) (or the image above) as the server owner. Invite the bot to the server of your choice and, if necessary, promote it to allow for posting in your desired channel(s).

## Support me
You can support me by contributing to the code base, creating valuable issues or by sending me a donation [![Support me](https://img.shields.io/badge/PayPal-Support%20me-7289da?style=for-the-badge)](https://paypal.me/kruhlmann)

## Usage

To have an item linked simply type the name of the item in the `/item` command.
Typing a partial name will give you autocomplete suggestions.

![Showcase](doc/showcase.png)

### Docker compose file

```yml
version: '3'
services:
  classicdb_bot:
    image: cr.kruhlmann.dev/classicdb_bot
    environment:
      - CLASSICDB_BOT_TOKEN=<your_bot_token>
      - CLASSICDB_BOT_CLIENT_ID=<your_client_id>
      - CLASSICDB_BOT_PROD=1
      - CLASSICDB_BOT_DISCORD_REST_VERSION=9
```
