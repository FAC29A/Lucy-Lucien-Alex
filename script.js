// Load environment variables from .env file
require("dotenv").config();

// Import necessary classes from discord.js library
const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  ChannelType,
} = require("discord.js");

const commandActions = require("./commands");
const jokes = require("./jokes.js");

//Array that will contain the history
const history = require("./history");

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
});

// Command prefix
const prefix = "!";
// Trigger for proactive DM sending (for example, if a message contains a specific keyword)
const triggerKeyword = "notify";

client.once(Events.ClientReady, (createdClient) => {
  console.log(`Logged in as ${createdClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // Get the bot's user ID
  let botId = client.user.id;

  // Check if the message is a Direct Message
  if (message.channel.type === ChannelType.DM) {
    // Check user privacy settings
    const userPrivacySettings = message.author.settings || { allowDMs: true };
    console.log(
      `User ${message.author.tag} - allowDMs: ${userPrivacySettings.allowDMs}`,
    );
    if (!userPrivacySettings.allowDMs) {
      console.log(`User ${message.author.tag} has disabled direct messages.`);
      return;
    }

    // Check if the message starts with the prefix and execute the command
    if (message.content.startsWith(prefix)) {
      executeCommand(message, botId, commandActions, prefix);
      return; // Exit the function to avoid executing the prefix check
    }
    // Send a DM response
    commandActions["ask"](message, botId);
    console.log(`Message: ${message.content}`);
    history.push(`${message.author.tag}: ${message.content}`);
    return; // Exit the function to avoid executing the prefix check
  }

  // Check for the trigger keyword
  if (message.content.toLowerCase().includes(triggerKeyword)) {
    // Get the target channel (replace 'TARGET_CHANNEL_ID' with the actual channel ID)
    const targetChannelId = "1180643625781170206";

    try {
      const guild = await client.guilds.fetch(message.guild.id);
      const targetChannel = await guild.channels
        .fetch(targetChannelId)
        .catch((error) => {
          console.error(`Failed to fetch target channel: ${error.message}`);
          throw error; // Rethrow the error to prevent further execution
        });

      // Check if the target channel exists and is a text channel
      if (targetChannel && targetChannel.type === ChannelType.GuildText) {
        console.log("Target channel is a text channel. Proceeding...");

        // Fetch all members in the target channel with the 'force' option
        await targetChannel.guild.members.fetch({ force: true });

        // Fetch all members in the target channel
        const members = targetChannel.guild.members.cache;

        // Check if the message contains the notify keyword
        if (message.content.toLowerCase().includes("[notify]")) {
          try {
            const notifyMessage = message.content
              .slice(
                message.content.toLowerCase().indexOf("[notify]") +
                  "[notify]".length,
              )
              .trim();

            // Iterate over each member and send a proactive DM
            members.forEach(async (member) => {
              // Check user privacy settings before sending a DM
              const userPrivacySettings = member.user.settings; // Adjust this based on your actual user settings structure

              try {
                // Send a DM with the specified message
                await member.send(
                  `${message.author.tag} says: ${notifyMessage}`,
                );
              } catch (error) {
                console.error(
                  `Failed to send DM to ${member.user.tag}: ${error.message}`,
                );
              }
            });
          } catch (error) {
            console.error(`Error processing !notify command: ${error.message}`);
          }
        }
      } else {
        console.log("Target channel not found or is not a text channel.");
      }
    } catch (error) {
      console.error(
        `Error fetching target channel (${targetChannelId}): ${error.message}`,
      );
    }
  }

  // Check if the message mentions the bot

  if (
    message.content.includes(`<@${botId}>`) ||
    message.content.includes(`<@!${botId}>`)
  ) {
    const words = message.content.split(/\s+/);
    // Find the index of the bot mention
    const botMentionIndex = words.findIndex(
      (word) => word.includes(`<@${botId}`) || word.includes(`<@!${botId}`),
    );
    // Check if there's a next word after the mention
    if (botMentionIndex < words.length - 1) {
      // Extract the next word as the command keyword
      let theWordAfterBoxid = words[botMentionIndex + 1].toLowerCase();
      let commandKeyword;

      // Check if the command keyword is in commandActions
      if (!commandActions.hasOwnProperty(theWordAfterBoxid)) {
        commandKeyword = "ask";
      } else {
        commandKeyword = theWordAfterBoxid;
      }
      // Respond to the mention with the extracted command
      commandActions[commandKeyword](message, botId);
      console.log(`Message: ${message.content}`);
      history.push(`${message.author.tag}: ${message.content}`);
      return; // Exit the function to avoid executing the prefix check
    }
  }

  history.push(`${message.author.tag}: ${message.content}`);

  if (message.content.startsWith(prefix)) {
    executeCommand(message, botId, commandActions, prefix);
  }
});

// Function to handle command execution
function executeCommand(message, botId, commandActions, prefix) {
  const command = message.content.slice(prefix.length).trim().split(/ +/)[0];

  if (command in commandActions) {
    commandActions[command](message, botId);
  } else {
    message.reply(`Command not found: ${command}`);
    console.log(`Command not found: ${command}`);
  }
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
