// Load environment variables from .env file
require('dotenv').config()

// Import necessary classes from discord.js library
const {
	Client,
	Events,
	GatewayIntentBits,
	Partials,
	ChannelType,
} = require('discord.js')

const {
	commandActions,
	//dmCommandActions,
	sendHelpMessage,
	//sendDMHelpMessage,
} = require('./commands')

//Array that will contain the history
const history = require('./history')

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
})

// Command prefix
const prefix = '!'
// Trigger for proactive DM sending
const triggerKeyword = '[notify]'

client.once(Events.ClientReady, (createdClient) => {
	console.log(`Logged in as ${createdClient.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return

	// Check if we're awaiting feedback from this user
	if (awaitingFeedback.has(message.author.id)) {
		// We could either ignore all messages until feedback is given,
		// or handle messages differently here if needed.
		console.log(
			`Awaiting feedback from ${message.author.tag}, message received: ${message.content}`
		)
		return // Do nothing else, wait for feedback
	}

	// Get the bot's user ID
	let botId = client.user.id

	// Check if the message is a Direct Message
	if (message.channel.type === ChannelType.DM) {
		// Check user privacy settings
		const userPrivacySettings = message.author.settings || { allowDMs: true }
		console.log(
			`User ${message.author.tag} - allowDMs: ${userPrivacySettings.allowDMs}`
		)
		if (!userPrivacySettings.allowDMs) {
			console.log(`User ${message.author.tag} has disabled direct messages.`)
			return
		}

		// Check if the message starts with the prefix and execute the command
		if (message.content.startsWith(prefix)) {
			executeCommand(message, botId, commandActions, prefix)

			return // Exit the function to avoid executing the prefix check
		}
		// Send a DM response
		commandActions['ask'].action(message, botId)
		console.log(`Message: ${message.content}`)
		history.push(`${message.author.tag}: ${message.content}`)
		return // Exit the function to avoid executing the prefix check
	} else {
		// This is a public channel message

		// Check for the trigger keyword
		if (message.content.toLowerCase().includes(triggerKeyword)) {
			try {
				const guild = await client.guilds.fetch(message.guild.id)
				const targetChannel = await guild.channels
					.fetch(message.channelId)
					.catch((error) => {
						console.error(`Failed to fetch target channel: ${error.message}`)
						throw error // Rethrow the error to prevent further execution
					})

				// Fetch all members in the target channel
				const members = await guild.members.fetch({ force: true })

				const notifyMessage = message.content
					.slice(
						message.content.toLowerCase().indexOf(triggerKeyword) +
							triggerKeyword.length
					)
					.trim()

				// Iterate over each member and send a proactive DM
				for (const [_, member] of members) {
					try {
						// Fetch the member to ensure additional data is available
						const fetchedMember = await targetChannel.guild.members.fetch(
							member.id
						)

						// Check user privacy settings before sending a DM. If user.settings doesnt have a allowDMs value
						// it will create it with the default value :true
						const userPrivacySettings = fetchedMember.user.settings || {
							allowDMs: true,
						}

						if (userPrivacySettings.allowDMs) {
							// Send a DM with the specified message
							try {
								await fetchedMember.send(
									`${message.author.tag} says: ${notifyMessage}`
								)
								// Log the allowDMs permission for the member
								console.log(
									`Sent DM to ${fetchedMember.user.tag}. allowDMs: ${userPrivacySettings.allowDMs}`
								)
							} catch (error) {
								console.error(
									`Failed to send DM to ${member.user.tag}: ${error.message}`
								)
							}
						} else {
							console.log(
								`User ${fetchedMember.user.tag} has disabled direct messages.`
							)
						}
					} catch (error) {
						console.error(
							`Failed fetch member ${member.user.tag}: ${error.message}`
						)
					}
				}
			} catch (error) {
				console.error(
					`Error fetching target channel (${targetChannelId}): ${error.message}`
				)
			}
		}

		// Check if the message tags the bot
		if (
			message.content.includes(`<@${botId}>`) ||
			message.content.includes(`<@!${botId}>`)
		) {
			const words = message.content.split(/\s+/)
			// Find the word index of the bot mention
			const botMentionIndex = words.findIndex(
				(word) => word.includes(`<@${botId}`) || word.includes(`<@!${botId}`)
			)
			// Check if there's a next word after the mention
			if (botMentionIndex < words.length - 1) {
				// Extract the next word as the command keyword
				let theWordAfterBoxid = words[botMentionIndex + 1].toLowerCase()
				let commandKeyword

				// Check if the command keyword is in commandActions
				if (commandActions.hasOwnProperty(theWordAfterBoxid)) {
					commandKeyword = theWordAfterBoxid
				} else {
					commandKeyword = 'ask'
				}
				// Respond to the mention with the extracted command
				commandActions[commandKeyword].action(message, botId)
				history.push(`${message.author.tag}: ${message.content}`)
				return // Exit the function to avoid executing the prefix check
			}
		}
		history.push(`${message.author.tag}: ${message.content}`)

		// Message doesnt tag the bot but contains command
		if (message.content.startsWith(prefix)) {
			//executeCommand(message, botId, dmCommandActions, commandActions, prefix)
			executeCommand(message, botId, commandActions, prefix)
		}
	}
})

async function executeCommand(message, botId, commandActions, prefix) {
	try {
		const trimmedContent = message.content.slice(prefix.length).trim()
		const args = trimmedContent.split(/\s+/)
		const command = args.shift().toLowerCase()
		// Check if the feedback flag is present
		const feedbackFlag = args.includes('-f')

		// Example usage in your code:
		if (command in commandActions) {
			if (message.channel.type === ChannelType.DM) {
				// Handle the case where a non-DM exclusive command is used in DMs
				commandActions[command].action(message, botId)
				// collect feedback messages
				waitForFeedback(message, feedbackFlag)
			} //Public channel
			else {
				// Execute the command
				if (commandActions[command].isDMExclusive) {
					message.reply(`Command not found: ${command}`)
					await sendHelpMessage(message)
				} else {
					commandActions[command].action(message, botId)
				}
			}
		} else {
			message.reply(`Command not found: ${command}`)
			await sendHelpMessage(message)
		}
	} catch (error) {}
}

const awaitingFeedback = new Map() // Tracks which users are currently providing feedback

async function collectFeedback(message) {
	try {
		// Set the flag indicating we're awaiting feedback from this user
		awaitingFeedback.set(message.author.id, true)

		// Send a feedback request via DM
		await message.author.send(
			'Please provide some feedback on your experience with the command you just used.'
		)

		// Listen for the next DM from this user as feedback
		const filter = (m) => m.author.id === message.author.id
		const dmChannel = await message.author.createDM()
		const feedbackCollector = dmChannel.createMessageCollector({
			filter,
			// Max number or requests allowed
			max: 1,
			time: 20000,
		})

		feedbackCollector.on('collect', (m) => {
			if (awaitingFeedback.get(m.author.id)) {
				console.log(`Feedback received from ${m.author.tag}: ${m.content}`)
				m.reply('Thank you for your feedback!')
				awaitingFeedback.delete(m.author.id) // Reset the flag after receiving feedback
			}
		})

		feedbackCollector.on('end', (collected) => {
			if (!collected.size && awaitingFeedback.get(message.author.id)) {
				message.author.send('Feedback request timed out.')
				awaitingFeedback.delete(message.author.id) // Reset the flag after timeout
			}
		})
	} catch (error) {
		console.error('Error in collecting feedback:', error)
		awaitingFeedback.delete(message.author.id) // Make sure to reset the flag in case of error
	}
}

async function waitForFeedback(message, feedbackFlag) {
	if (feedbackFlag) {
		await collectFeedback(message)
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)
