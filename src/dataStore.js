const Guild = require('./schemas/guild');
const mongoose = require('mongoose');

// Generates a new data set for the current guild if none exists, returns it
async function getData(guild) {
	let guildProfile = await Guild.findOne({ guildId: guild.id });
	if (!guildProfile) {
		guildProfile = await new Guild({
			_id: mongoose.Types.ObjectId(),
			guildId: guild.id,
			guildName: guild.name,
			game: {
				isActive: false,
				players: [],
				songs: [],
				round: {
					number: 0,
					hasGuessed: [],
				},
				channelId: 0,
			},
		});
		await guildProfile.save().catch(console.error);
	}

	return guildProfile;
}

// Saves current data in MongoDB
async function setData(data) {
	await data.save().catch(console.error);
}

// Resets game data and saves it in MongoDB
async function clear(data) {
	data.game = {
		isActive: false,
		players: [],
		songs: [],
		round: {
			number: 0,
			hasGuessed: [],
		},
		channelId: 0,
	};

	await data.save().catch(console.error);
}

module.exports = {
	getData: getData,
	setData: setData,
	clear: clear,
};