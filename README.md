# Discord Music Bot

A bot that allows members of Discord servers to play a music guessing game.
Created by: 
* **Kevin Tran (kevin.tran73@outlook.com)**
* **Alan Nguyen (aland.nguyen24@gmail.com)**

## Features

### Highlights

* Simple and easy to use
* Pick from 10+ genres for the music guessing game
* YouTube support
* Slash commands support
* Operate in multiple servers at the same time
* Utilises MongoDB Atlas for easy scaling of database

### Commands

All the available commands in the bot.

|      Name      |            Description             |                    Options                    |
|:---------------|:----------------------------------:|----------------------------------------------:|
|   **/play**    |      Play a song from youtube      | \<query>                                      |
| **/autoplay**  |     Set music autoplay on/off      | \<enable>                                     |
|   **/queue**   |        See the music queue         |                                               |
|   **/start**   |         Starts a new game          | \<genre>, \<rounds>, \<min-year>, \<max-year> |
|  **/points**   | See your current points in the game|                                               |
|**/leaderboard**|     Show the game leaderboard      |                                               |
|   **/skip**    |       Skip the current song        |                                               |
|   **/end**     |         End the queue/game         |                                               |

## Installation

### Manual
* Clone the repository. (`git clone https://github.com/kevintran73/discord-music-guessing-game`)
* Create a MusixMatch Developer account at `https://developer.musixmatch.com`
* Create a MongoDB Atlas account at `https://www.mongodb.com/atlas/database`, and setup dataCluster by connecting your application
* Copy the `.env.example` file as `.env` and fill it.
```
 - `token` is the token of your Discord Bot
 - `databaseToken` is your MongoDB Atlas dataCluster connection string
 - `apiKey` is your MusixMatch Developer API key
```
* Install the dependencies. (`npm install`)
* Start the bot! (`npm start` or `node .`)

## Usage

### Music Guessing Game
You can make a guess on the song currently being played during a game by typing the song's name in any text channel in the server.

### Sample Deployment
You can find a sample deployment of our bot in this Discord server: https://discord.gg/8q9brxHD6W

### Inviting to Discord Server
Want to use our bot in your Discord server? Use our [invite link](https://discord.com/api/oauth2/authorize?client_id=1055713303395061821&permissions=8&scope=bot%20applications.commands) (must have administrator permissions).
