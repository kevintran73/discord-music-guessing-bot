const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData } = require('../../dataStore');
const { generateLeaderboardString } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check out the game leaderboard!'),

	async execute(interaction) {
		const data = await getData(interaction.guild);
		
		if (data.game.isActive) {
			const leaderboardString = generateLeaderboardString(data.game.players);
			const embed = new EmbedBuilder()
				.setTitle('Leaderboard')
				.setDescription(leaderboardString);

			await interaction.reply({
				embeds: [embed]
			});
		} else {
			await interaction.reply({
				content: '❌ **A game is not active!**'
			});
		}
	},
};