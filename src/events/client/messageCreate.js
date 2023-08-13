const { getData, setData } = require('../../dataStore');
const { getPlayer } = require('../../helpers');

// If a game is active and the messager is a player, allow to make a guess
module.exports = {
	name: 'messageCreate',
	on: true,
	async execute(message, client) {
		const data = await getData(message.guild);
		const player = getPlayer(data.game.players, message.member.user.id);

		if (data.game.isActive && player) {
			const queue = await client.player.getQueue(message.member.guild);
			if (queue.playing) {
				const round = data.game.round.number - 1;
				if (message.content.toLowerCase().replace(/([^\w])/g, '').replace(/and/g, '') === data.game.songs[round].name.toLowerCase().replace(/([^\w])/g, '').replace(/and/g, '') &&
					!data.game.round.hasGuessed.includes(message.member.user.id)) {
					const channel = await client.channels.fetch(message.channelId);
					let points = 100 - (10 * data.game.round.hasGuessed.length);
					if (points <= 0) {
						points = 10;
					}
					player.points += points;
					data.game.round.hasGuessed.push(message.member.user.id);
					channel.send(`**🎉 <@${message.author.id}> guessed the song! 🎉**`);
					message.delete();
					if (data.game.round.hasGuessed.length === data.game.players.length) {
						channel.send('**🪩 All players have guessed the song! 🪩**');
						queue.skip();
					}
				}
			}
			await setData(data);
		}
	}
};
