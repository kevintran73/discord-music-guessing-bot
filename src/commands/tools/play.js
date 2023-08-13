const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Specify song name')
				.setRequired(true)
		),

	async execute(interaction, client) {
		await interaction.deferReply();
		const data = await getData(interaction.guild);

		if (!interaction.member.voice.channelId) {
			return interaction.editReply({ content: '❌ **You are not in a voice channel!**', ephemeral: true });
		} else if (data.game.isActive) {
			return interaction.editReply('**There is a game active!**');
		}
        
		const queue = await client.player.createQueue(interaction.guild, {
			autoSelfDeaf: false
		});

		// Connect to the vc
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.editReply({ content: '❌ **Could not join your voice channel!**', ephemeral: true });
		}

		// Try to get the requested track
		const query = interaction.options.getString('query');
		const track = await client.player.search(query, {
			requestedBy: interaction.user,
		}).then(x => x.tracks[0]);

		if (!track) {
			return await interaction.followUp({ content: `❌ Track **${query}** not found!` });
		}

		await queue.addTrack(track);
		if (!queue.playing) {
			await queue.play();
		}
    
		const embed = new EmbedBuilder()
			.setTitle(`**${track.title}**`)
			.setURL(track.url)
			.setDescription(`🎶 Added to the queue! (**${track.duration}**)`);

		await interaction.editReply({
			embeds: [embed]
		});
	}
};