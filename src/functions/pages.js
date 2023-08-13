const { ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

async function buttonPages(interaction, totalPages, pages) {
	const forwardButton = new ButtonBuilder()
		.setCustomId('next-page')
		.setStyle(ButtonStyle.Primary)
		.setLabel('Next');

	const backButton = new ButtonBuilder()
		.setCustomId('back-page')
		.setStyle(ButtonStyle.Primary)
		.setLabel('Prev')
		.setDisabled(true);

	const row = new ActionRowBuilder()
		.addComponents(
			backButton,
			forwardButton
		);

	let index = 0;

	if (totalPages === 1) {
		forwardButton.setDisabled(true);
		return await interaction.editReply({
			embeds: [pages[index]],
			components: [row],
		});
	}
	const currentPage = await interaction.editReply({
		embeds: [pages[index]],
		components: [row],
		fetchReply: true,
	});

	// To receive user interactions with the buttons
	const collector = await currentPage.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 15000
	});

	collector.on('collect', async (i) => {
		if (i.user.id !== interaction.user.id) {
			return i.reply({
				content: 'You can\'\t use these buttons!',
				ephemeral: true,
			});
		}

		// Changing pages
		await i.deferUpdate();
		if (i.customId === 'next-page') {
			index++;
			backButton.setDisabled(false);
			if ((index + 1) === totalPages) forwardButton.setDisabled(true);
		} else if (i.customId === 'back-page') {
			index--;
			forwardButton.setDisabled(false);
			if (index === 0) backButton.setDisabled(true);
		}

		await currentPage.edit({
			embeds: [pages[index]],
			components: [row],
		});

		collector.resetTimer();
	});

	// Remove buttons when the collector ends
	collector.on('end', async () => {
		await currentPage.edit({
			embeds: [pages[index]],
			components: [],
		});
	});
	return currentPage;
}

module.exports = buttonPages;
