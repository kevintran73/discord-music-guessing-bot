const { getData, setData } = require('../../dataStore');
const { inSameChannel, getPlayer } = require('../../helpers');

// If a player is joining the call, add the member as a player of the game
// If the bot is joining the call, add all current members as players of the game
module.exports = {
	name: 'voiceStateUpdate',
	on: true,
	async execute(oldState, newState, client) {
		const data = await getData(newState.guild);

		if (newState.channel !== null && data.game.isActive) {
			const channel = await client.channels.fetch(newState.channel.id);
			if (newState.id !== client.user.id && inSameChannel(newState.channel.members, client)) {
				if (!getPlayer(data.game.players, newState.member.user.id)) {
					data.game.players.push({
						id: newState.member.user.id,
						username: newState.member.user.username,
						points: 0,
					});
					channel.send(`***🤓 ${newState.member.user.username}*** joined the game! 🤓`);
				}
			} else if (newState.id === client.user.id) {
				newState.channel.members.forEach((member) => {
					if (!getPlayer(data.game.players, member.user.id) && member.user.id !== client.user.id) {
						data.game.players.push({
							id: member.user.id,
							username: member.user.username,
							points: 0,
						});
						channel.send(`***🤓 ${member.user.username}*** joined the game! 🤓`);
					}
				});
				data.game.channelId = newState.channel.id;
				console.log(`Channel: ${data.game.channelId} ${newState.channel.id}`);
			}

			await setData(data);
			console.log(data);
		}
	}
};