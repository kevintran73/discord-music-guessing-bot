const { apiKey } = process.env;
const baseUrl = 'https://api.musixmatch.com/ws/1.1';

// Returns an array of random unique songs from the MusixMatch API
async function generateRandomSongs(amount, genre, min, max) {
	const page = Math.floor(Math.random() * 5);
	const pageNumber = Math.floor(Math.random() * 20) + 20;

	let results = `${baseUrl}/track.search?format=json&apikey=${apiKey}&s_track_rating=desc&f_music_genre_id=${genre}&page=${page}&page_size=${pageNumber}`;
	if (min > 0) {
		results += `&f_track_release_group_first_release_date_min=${min}0101`;
	}
	if (max > 0) {
		results += `&f_track_release_group_first_release_date_max=${max}0101`;
	}
	results = await fetch(results).then(res => res.json());

	if (results.message.body.track_list.length < amount) {
		return;
	}
	const returnTracks = [];
	while (returnTracks.length !== amount) {
		let track = results.message.body.track_list[Math.floor(Math.random() * results.message.body.track_list.length)].track;
		const trackName = track.track_name.replace(/(\(.*?\))|(\[.*?\])|(\{.*?\})/g, '');
		let trackInfo = {
			name: trackName,
			artist: track.artist_name,
		};
		if (!returnTracks.find(element => element.name === trackInfo.name)) {
			returnTracks.push(trackInfo);
		}
	}

	return returnTracks;
}

// Returns true if the bot is in members and false otherwise
function inSameChannel(members, client) {
	let sameChannel = false;
	members.forEach((member) => {
		if (member.user.id === client.user.id) {
			sameChannel = true;
		}
	});

	return sameChannel;
}

// Returns the player as an object if found and undefined otherwise
function getPlayer(players, id) {
	return players.find(player => player.id === id);
}

// Returns a set array of numbers as the points leaderboard, sorted highest to lowest
function getLeaderboard(players) {
	const points = [];
	for (const player of players) {
		points.push(player.points);
	}

	const leaderboard = Array.from(new Set(points));
	leaderboard.sort((a, b) => b - a);

	return leaderboard;
}

// Returns a string to be used in a leaderboard embed description
function generateLeaderboardString(players) {
	const leaderboard = getLeaderboard(players);

	let leaderboardString = '';
	let rank = 1;
	for (const point of leaderboard) {
		if (rank === 1) {
			leaderboardString += '🥇 ';
		} else if (rank === 2) {
			leaderboardString += '🥈 ';
		} else if (rank == 3) {
			leaderboardString += '🥉 ';
		}
		leaderboardString += `**${getOrdinal(rank)}** - `;

		for (const player of players) {
			if (player.points === point) {
				leaderboardString += `${player.username}, `;
			}
		}
		leaderboardString = leaderboardString.slice(0, -2);
		leaderboardString += ` (**${point} points**)\n`;
		rank += 1;
	}
	leaderboardString = leaderboardString.slice(0, -1);

	return leaderboardString;
}

// Returns the number with the according suffix as a string
function getOrdinal(number) {
	const suffix = ['th', 'st', 'nd', 'rd'];
	const modulo = number % 100;
	return number + (suffix[(modulo - 20) % 10] || suffix[modulo] || suffix[0]);
}

module.exports = {
	fetchSongs: generateRandomSongs,
	inSameChannel: inSameChannel,
	getPlayer: getPlayer,
	getLeaderboard: getLeaderboard,
	getOrdinal: getOrdinal,
	generateLeaderboardString: generateLeaderboardString,
};
