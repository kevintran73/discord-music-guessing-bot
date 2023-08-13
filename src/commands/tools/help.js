const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows all bot commands'),
	async execute(interaction) {
		const details = `\`play\`  Type the song name or send a link to play a song
      \`autoplay\` Set autoplay on or off
      \`queue\` See what songs are in the queue
      \`start\` Starts a game
      \`points\` See how many points you have
      \`leaderboard\` Show the leaderboard
      \`skip\` Skips the song in queue or the round for the game
      \`end\` Removes all songs from queue or ends the game`;

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Creator 1')
					.setStyle(ButtonStyle.Link)
					.setURL('https://www.linkedin.com/in/alan-nguyen-121374232/'),
			)
			.addComponents(
				new ButtonBuilder()
					.setLabel('Creator 2')
					.setStyle(ButtonStyle.Link)
					.setURL('https://www.linkedin.com/in/kevin-tran-5aa969232/')
			);

		const embed = new EmbedBuilder()
			.setTitle('Fruiti Slash Commands')
			.setDescription(details)
			.setColor(0x00bfff)
			.setFooter({text: 'Find us on LinkedIn!'});

		await interaction.reply({
			embeds: [embed],
			components: [row]
		});
	}
};
