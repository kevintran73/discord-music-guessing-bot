const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const buttonPages = require('../../functions/pages');
const { getData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('displays the current song queue'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const data = await getData(interaction.guild);
		let queue = client.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.editReply('**❌ There are no songs in the queue!**');
		} else if (data.game.isActive) {
			return await interaction.editReply('**❌ There is an active game!**');
		} else if (!queue.playing) {
			// Wait for a song to begin playing to prevent errors
			await new Promise(resolve => {
				const id = setInterval(() => {
					queue = client.player.getQueue(interaction.guildId);
					if (!queue || queue.playing) {
						resolve('foo');
						clearInterval(id);
					}
				}, 300);
			});
		}
		if (!queue) {
			return await interaction.editReply('**❌ There are no songs in the queue!**');
		}

		// Create embed for the queue
		const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
		const currentSong = queue.current;
		let pages = [];
		for (let i = 0; i < totalPages; i++) {
			let queueString = queue.tracks.slice(i * 10, i * 10 + 10).map((song, j) => {
				return `**${i * 10 + j + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`;
			}).join('\n');

			pages[i] = new EmbedBuilder()
				.setDescription('**Currently Playing**\n' +
          (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : 'None') +
          `\n\n**Queue**\n${queueString}`)
				.setFooter({ text: `Page ${i + 1} of ${totalPages}` });
		}

		buttonPages(interaction, totalPages, pages);
	}
};
