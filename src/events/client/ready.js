const { getData, clear } = require('../../dataStore');

// Clears all game data in existing servers once ready
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.guilds.cache.forEach(async (guild) => {
			let data = await getData(guild);
			await clear(data);
		});
		console.log(`Ready!!! ${client.user.tag} is logged in and online.`);
	}
};