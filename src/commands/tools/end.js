const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const { getData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Removes all song in the queue or ends the game early'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const data = await getData(interaction.guild);
		let queue = client.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.editReply('**❌ There are no songs in the queue!**');
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

		// Check if autoplay is on 
		if (queue.repeatMode) {
			await queue.setRepeatMode(QueueRepeatMode.OFF);
		}

		queue.clear();
		queue.skip();
		if (data.game.isActive) {
			return await interaction.editReply('***The game has been ended early***');
		} else {
			return await interaction.editReply('**Queue has been cleared!**');
		}
	}
};
