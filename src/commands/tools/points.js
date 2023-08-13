const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData } = require('../../dataStore');
const { getPlayer, getLeaderboard, getOrdinal } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Check your current points.'),

	async execute(interaction) {
		const data = await getData(interaction.guild);
		if (data.game.isActive) {
			const player = getPlayer(data.game.players, interaction.user.id);
			const leaderboard = getLeaderboard(data.game.players);
			let first = '';
			for (const user of data.game.players) {
				if (user.points === leaderboard[0]) {
					first += `${user.username}\n`;
				}
			}

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}`)
				.setDescription(`Points: ${player.points}`)
				.setColor(0x18e1ee)
				.setThumbnail(interaction.user.displayAvatarURL())
				.addFields([
					{
						name: 'Current Positionㅤ',
						value: `${getOrdinal(leaderboard.indexOf(player.points) + 1)}`,
						inline: true
					},
					{
						name: 'First Placeㅤ',
						value: `${first}`,
						inline: true
					}
				]);

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