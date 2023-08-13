const { getData, setData } = require('../../dataStore');

// Prepares for the next round and tells everyone what the song was from the round
module.exports = {
	name: 'trackEnd',
	async execute(queue, track, client) {
		const data = await getData(queue.guild);
		if (data.game.isActive) {
			await new Promise(resolve => setTimeout(resolve, 2000));
			const updatedData = await getData(queue.guild);
			if (!updatedData.game.isActive) {
				setData(updatedData);
				return;
			}
			const channel = await client.channels.fetch(data.game.channelId);
			const round = data.game.round.number;
			channel.send(`**⌛ Round ${round} is over!** The song was ***${data.game.songs[round - 1].name}*** by ***${data.game.songs[round - 1].artist}***!`);
			data.game.round.hasGuessed = [];
			if ((round + 1) === data.game.songs.length) {
				channel.send('***Final round is beginning!***');
			} else if (round < data.game.songs.length) {
				channel.send(`***Round ${round + 1} is beginning...***`);
			}
			console.log('track has ended');
		}
		await setData(data);
	}
};
