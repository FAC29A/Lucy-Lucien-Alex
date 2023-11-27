// Load environment variables from .env file
require("dotenv").config()

// Import necessary classes from discord.js library
const { Client, Events, GatewayIntentBits } = require("discord.js")

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once(Events.ClientReady, (createdClient) => {
  console.log(`Ready! Logged in as ${createdClient.user.tag}`)
  rl.prompt() // Initial prompt
})

client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots to prevent infinite loops
  if (message.author.bot) return

  console.log() // Add a line break before the message
  console.log(`Message from ${message.author.tag}: ${message.content}`)
  rl.prompt() // Re-prompt after logging the message
})

const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.setPrompt("Enter a message to send: ")

rl.on("line", (input) => {
  // The channel ID where you want to send messages
  const channelId = "1177668341364707472" // Replace with your actual channel ID

  // Fetch the channel from the client
  const channel = client.channels.cache.get(channelId)
  if (channel) {
    // Send the message to the channel
    channel
      .send(input)
      .then(() => {
        rl.prompt() // Prompt for the next input
      })
      .catch(console.error)
  } else {
    console.log("Channel not found!")
    rl.prompt()
  }
})

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)
