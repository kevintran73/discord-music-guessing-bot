require('dotenv').config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages
	]
});

client.commands = new Collection();
client.buttons = new Collection();
client.player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 30,
		filter: 'audioonly',
	},
});
client.commandArray = [];

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
	if (fs.statSync(`./src/functions/${folder}`).isFile()) {
		continue;
	}
	const functionFiles = fs
		.readdirSync(`./src/functions/${folder}`)
		.filter((file) => file.endsWith('.js'));

	for (const file of functionFiles) {
		require(`./functions/${folder}/${file}`)(client);
	}
}

client.handleEvents();
client.handleCommands();
client.login(token);
(async () => {
	await connect(databaseToken).catch(console.error);
})();
