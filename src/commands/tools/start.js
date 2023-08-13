const { SlashCommandBuilder } = require('discord.js');
const { fetchSongs } = require('../../helpers');
const { getData, setData } = require('../../dataStore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start a fresh game!')
		.addNumberOption((option) =>
			option.setName('genre')
				.setDescription('Genre of music')
				.setRequired(true)
				.addChoices(
					{ name: 'any', value: 34 },
					{ name: 'pop', value: 14 },
					{ name: 'k-pop', value: 51 },
					{ name: 'mando-pop', value: 1253 },
					{ name: 'canto-pop', value: 1656 },
					{ name: 'j-pop', value: 27 },
					{ name: 'anime', value: 29 },
					{ name: 'christmas', value: 1080 },
					{ name: 'r&b', value: 15 },
					{ name: 'contemporary r&b', value: 1136 },
					{ name: 'house', value: 1048 },
					{ name: 'hip hop rap', value: 18 },
					{ name: 'rock', value: 21 },
				)
		)
		.addNumberOption((option) =>
			option.setName('rounds')
				.setDescription('Number of rounds the game will have')
				.setMinValue(1)
				.setMaxValue(20)
				.setRequired(true)
		)
		.addNumberOption((option) =>
			option.setName('min-year')
				.setDescription('Min year the songs are from')
				.setMinValue(1900)
				.setMaxValue(2023)
				.setRequired(false)
		)
		.addNumberOption((option) =>
			option.setName('max-year')
				.setDescription('Max year the songs are from')
				.setMinValue(1900)
				.setMaxValue(2023)
				.setRequired(false)
		),

	async execute(interaction, client) {
		await interaction.deferReply();
		let data = await getData(interaction.guild);
		if (!interaction.member.voice.channelId) {
			return interaction.editReply('❌ **You are not in a voice channel!**');
		} else if (data.game.isActive) {
			return interaction.editReply('❌ **A game is already active!**');
		}

		const minYear = interaction.options.getNumber('min-year');
		const maxYear = interaction.options.getNumber('max-year');
		if (minYear > maxYear) {
			return interaction.editReply('❌ **Min year cannot be bigger than max year!**');
		}

		// Check if there is a queue active
		const oldQueue = await client.player.getQueue(interaction.guild);
		if (oldQueue) {
			return interaction.editReply('❌ **A music queue is active!**');
		}

		// Create new queue for game
		const queue = await client.player.createQueue(interaction.guild, {
			autoSelfDeaf: false
		});

		// Acquire random songs for game
		const rounds = interaction.options.getNumber('rounds');
		const genre = interaction.options.getNumber('genre');
		const songs = await fetchSongs(rounds, genre, minYear, maxYear);
		if (!songs) {
			queue.destroy();
			return await interaction.editReply('❌ **Could not find enough songs!**');
		}

		// Connect to the vc
		try {
			if (!queue.connection) {
				await queue.connect(interaction.member.voice.channel);
			}
			data.game.isActive = true;
			await setData(data);
		} catch {
			queue.clear();
			queue.skip();
			return await interaction.editReply('❌ **Could not join your voice channel!**');
		}

		await new Promise(resolve => setTimeout(resolve, 1000));
		data = await getData(interaction.guild);
		data.game.songs = songs;
		await setData(data);
		console.log(songs);
		for (const song of songs) {
			let track = await client.player.search(`${song.name + song.artist} lyrics`, {
				requestedBy: interaction.user,
			}).then(x => x.tracks[0]);
			await queue.addTrack(track);
		}

		if (!queue.playing) {
			await queue.play();
		}

		await interaction.editReply({
			content: `🎮 **Successfully started a new game with ${rounds} round(s)!**`
		});
	},
};
