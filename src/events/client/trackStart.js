const { getData, setData } = require('../../dataStore');

// Increases round number and resets guesses at start of a round
module.exports = {
	name: 'trackStart',
	async execute(queue) {
		let data = await getData(queue.guild);
		if (data.game.isActive) {
			if (data.game.round.number > 0) {
				queue.setPaused(true);
				await new Promise(resolve => setTimeout(resolve, 3000));
				queue.setPaused(false);
			}
			data = await getData(queue.guild);
			data.game.round.number += 1;
			data.game.round.hasGuessed = [];
			console.log('track started');
		}
		await setData(data);
	}
};
