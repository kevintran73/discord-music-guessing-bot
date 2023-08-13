const { SlashCommandBuilder } = require('discord.js');
const { getData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song'),
	async execute(interaction, client) {
		let queue = client.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply('**❌ There are no songs in the queue!**');
		}
		// Wait for a song to begin playing to prevent errors
		if (!queue.playing) {
			await new Promise(resolve => {
				const id = setInterval(() => {
					queue = client.player.getQueue(interaction.guildId);
					if (queue.playing) {
						resolve('foo');
						clearInterval(id);
					}
				}, 300);
			});
		}

		const currentSong = queue.current;
		const data = await getData(interaction.guild);
		queue.skip();
		if (data.game.isActive) {
			if (queue.tracks.length + data.game.round.number !== data.game.songs.length) {
				return await interaction.reply(`**:track_next: Round ${data.game.round.number + 1} has been skipped!**`);
			}
			return await interaction.reply(`**:track_next: Round ${data.game.round.number} has been skipped!**`);
		} else {
			await interaction.reply(`:track_next: ** ${currentSong} has been skipped!**`);
		}
	}
};
