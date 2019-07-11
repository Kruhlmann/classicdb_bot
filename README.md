# Classic DB discord bot

*A discord bot for linking vanilla wow 1.12.1 items*

[![Discord Server](https://img.shields.io/discord/572880907682447380%20.svg?logo=discord)](https://discord.gg/38wH62F)
[![Build Status](https://travis-ci.org/Kruhlmann/classicdb_bot.svg?branch=master)](https://travis-ci.org/Kruhlmann/classicdb_bot)
[![Maintainability](https://api.codeclimate.com/v1/badges/31ac58008a241939aee1/maintainability)](https://codeclimate.com/github/Kruhlmann/classicdb_bot/maintainability)
[![Open issues](https://img.shields.io/github/issues-raw/Kruhlmann/classicdb_bot.svg?style=flat)](https://github.com/Kruhlmann/classicdb_bot/issues)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/2579/badge)](https://bestpractices.coreinfrastructure.org/projects/2579)
[![Version](https://img.shields.io/github/package-json/v/Kruhlmann/classicdb_bot.svg)](package.json)

## Setup

[![Connect to discord](connect.png)](https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=0)

To invite the bot click [this link](https://discordapp.com/oauth2/authorize?client_id=545640068056875048&scope=bot&permissions=0) (or the image above) as the server owner. Invite the bot to the server of your choice and, if necessary, promote it to allow for posting in your desired channel(s).

### Local setup
If you want to run your own instance of the bot the following packages are required (only tested on Ubuntu 18.04 & 19.04):
* gcc
* autoconf
* libtool
* build-essential
* make
* automake
* nodejs
* npm
* zlib1g-dev `debian based systems`

The following packages are reccomended:
* sqlite3
* pm2 `npm i -g pm2`

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
* pm2 `npm i -g pm2`

You can copy the [example database](db/example_db.db) or create your own with `sqlite3`. (Remember to specify the path of the database in the config file.)

Likewise you must rename [config.json.example](config.json.example) to `config.json` and fill it in with the required details.

## Usage

To have an item linked simply type the name of the item in square brackets.
Typing a partial name will result in the first item avaliable being fetched.

As such typing `[thunder]` will result in the following output:

![Output showcase](showcase.png)
