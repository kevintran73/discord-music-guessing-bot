const { getData, clear } = require('../../dataStore');

// Clears the data if bot disconnects from empty channel
module.exports = {
	name: 'channelEmpty',
	async execute(queue) {
		const data = await getData(queue.guild);
		await clear(data);
		console.log('channel is empty => disconnected');
	}
};
