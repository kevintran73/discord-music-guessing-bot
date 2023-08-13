const { getData, clear } = require('../../dataStore');

// Clears all data if the bot disconnects from a voice call
module.exports = {
	name: 'botDisconnect',
	async execute(queue) {
		const data = await getData(queue.guild);
		await clear(data);
		console.log('bot disconnect');
	}
};