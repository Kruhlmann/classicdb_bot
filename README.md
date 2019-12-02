# Classic DB discord bot

[![Discord Server](https://img.shields.io/discord/572880907682447380%20.svg?logo=discord&style=for-the-badge)](https://discord.gg/38wH62F)
[![Build Status](https://img.shields.io/travis/Kruhlmann/classicdb_bot.svg?style=for-the-badge)](https://travis-ci.org/Kruhlmann/classicdb_bot)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/Kruhlmann/classicdb_bot.svg?style=for-the-badge)](https://codeclimate.com/github/Kruhlmann/classicdb_bot/maintainability)
[![CII Best Practices](https://img.shields.io/cii/percentage/2579.svg?label=CII%20Best%20Practices&style=for-the-badge)](https://bestpractices.coreinfrastructure.org/projects/2579)

## Setup

<p align="center">
  <a href="https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=0">
    <img src="doc/connect.png" />
  </a>
</p>

To invite the bot click [this link](https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=0) (or the image above) as the server owner. Invite the bot to the server of your choice and, if necessary, promote it to allow for posting in your desired channel(s).

## Support me
You can support me by contributing to the code base, creating valuable issues or by sending me a donation [![Support me](https://img.shields.io/badge/PayPal-Support%20me-7289da?style=for-the-badge)](https://paypal.me/kruhlmann)

## Usage

To have an item linked simply type the name of the item in square brackets.
Typing a partial name will result in the first item avaliable being fetched.

As such typing `[thunder]` will result in the following output:

![Showcase](doc/showcase.png)

### Local setup

If you want to run your own instance of the bot the following packages are required:

* gcc
* autoconf
* libtool
* build-essential
* make
* automake
* nodejs
* npm

The following packages are reccomended:

* sqlite3
* ccze

You must rename [config.json.example](config.json.example) to `config.json` and fill it in with the required details.

Similarly, [aliases.json.example](aliases.json.example) must be renamed to `aliases.json` and filled out to enable aliases. 
