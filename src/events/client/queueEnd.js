const { EmbedBuilder } = require('discord.js');
const { getData, clear } = require('../../dataStore');
const { generateLeaderboardString } = require('../../helpers');

// Clears all data once a queue has ended
module.exports = {
	name: 'queueEnd',
	async execute(queue, client) {
		const data = await getData(queue.guild);
		if (data.game.isActive) {
			const channel = await client.channels.fetch(data.game.channelId);
			const leaderboardString = generateLeaderboardString(data.game.players);
			const embed = new EmbedBuilder()
				.setTitle('Leaderboard')
				.setDescription(leaderboardString);

			const round = data.game.round.number;
			channel.send(`**⌛ Round ${round} is over!** The song was ***${data.game.songs[round - 1].name}*** by ***${data.game.songs[round - 1].artist}***!`);
			channel.send('⏰ **Game has ended!** Final leaderboard *below*! ⏰');
			channel.send({
				embeds: [embed]
			});
		}
		await clear(data);

		console.log('queue has ended');
	}
};