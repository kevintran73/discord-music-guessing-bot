const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const { getData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('toggles autoplay on and off')
		.addBooleanOption((option) =>
			option.setName('enabled')
				.setRequired(true)
				.setDescription('enable and disable autoplay')
		),
	async execute(interaction, client) {
		const data = await getData(interaction.guild);
		if (!interaction.member.voice.channelId) {
			return interaction.reply({ content: '❌ **You are not in a voice channel!**', ephemeral: true });
		} else if (data.game.isActive) {
			return interaction.reply('❌ **There is a game active!**');
		}

		// Check if there is a queue active
		const queue = await client.player.getQueue(interaction.guild);
		if (!queue) {
			return interaction.reply('❌ **There are no songs in the queue!**');
		}

		// Turn on or off autoplay
		const autoplay = interaction.options.getBoolean('enabled');
		if (autoplay) {
			await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
			return interaction.reply(':loudspeaker:  | **Successfully enabled AutoPlay**');
		}
		if (!autoplay) {
			await queue.setRepeatMode(QueueRepeatMode.OFF);
			return interaction.reply(':loudspeaker:  | **Successfully disabled AutoPlay**');
		}
	}
};