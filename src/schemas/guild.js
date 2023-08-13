const { Schema, model } = require('mongoose');
const playerSchema = new Schema({ id: String, username: String, points: Number });
const songSchema = new Schema({ name: String, artist: String });
const guildSchema = new Schema({
	_id: Schema.Types.ObjectId,
	guildId: String,
	guildName: String,
	game: {
		isActive: false,
		players: [playerSchema],
		songs: [songSchema],
		round: {
			number: 0,
			hasGuessed: [String],
		},
		channelId: String,
	}
});

module.exports = model('Guild', guildSchema, 'guilds');