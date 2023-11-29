const jokes = require("./jokes");
const history = require("./history");
const OpenAIApi = require("openai");

// Initialize OpenAI SDK with API key from .env file

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// Data structure were we store all the commands
const commandActions = {
  ping: (message) => sendMessage(message, "Pong!"),
  hello: (message) => sendMessage(message, "Hi there!"),
  joke: (message) => randomJokes(message),
  echo: (message) => echoMessage(message),
  history: sendHistory,
  ask: (message) => chatGPT(message),
  help: sendHelpMessage,
  poll: (message) => pollCommand(message),
  // Add more commands and actions here
};

function sendMessage(message, response) {
  message.reply(response);
}

function sendHelpMessage(message) {
  // Get the command names from the commandActions object
  const commandNames = Object.keys(commandActions);

  // Create a help text string listing all commands
  const helpText =
    "Available commands:\n" + commandNames.map((name) => `!${name}`).join("\n");

  message.reply(helpText);
}

function randomJokes(message) {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const randomJoke = jokes[randomIndex];
  message.reply(randomJoke);
}

function sendHistory(message) {
  // Construct the history string
  const historyText = history.join("\n");
  message.reply(historyText);
}

function echoMessage(message) {
  // The resason of slice(5) is because there are 5 character in !echo
  const messageWithoutPrefix = message.content.slice(5).trim();
  message.reply(messageWithoutPrefix);
}

// Object to store conversation histories
const conversations = {};

async function chatGPT(message) {
  // User ID as the key for conversation history
  const userId = message.author.id;

  // Initialize conversation history if not present
  if (!conversations[userId]) {
    conversations[userId] = [
      { role: "system", content: "You are a helpful assistant." },
    ];
  }
  // Extract the query from the message
  const query = message.content.slice("!ask ".length).trim();
  conversations[userId].push({ role: "user", content: query });

  // Call the OpenAI API for a chat completion
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      //model: 'gpt-4',
      messages: conversations[userId],
    });

    // Get the reply and add it to the conversation history
    const reply = completion.choices[0].message.content;
    conversations[userId].push({ role: "assistant", content: reply });

    // Limit the conversation history length to avoid large payloads
    if (conversations[userId].length > 10) {
      conversations[userId] = conversations[userId].slice(-10);
    }

    console.log(completion.choices[0].message);

    // Send the response back to Discord
    if (reply) {
      message.reply(reply.trim());
    } else {
      message.reply("I didn't get a response. Please try again.");
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    message.reply(
      "Sorry, I encountered an error while processing your request.",
    );
  }
}

// Function to handle the 'poll' command
function pollCommand(message) {
  // Extract the question and options from the message content
  const [_, question, ...options] = message.content
    .slice(1 + "poll".length)
    .trim()
    .split(/\s+/);

  // Check if both question and options are provided
  if (question && options.length >= 2) {
    // Create the poll message
    const pollMessage =
      `**${question}**\n\n` +
      options.map((option, index) => `${index + 1}. ${option}`).join("\n");

    // Send the poll message
    message.channel.send(pollMessage).then((poll) => {
      // Add reactions to the poll message for each option
      options.slice(0, 9).forEach((_, index) => {
        poll.react(`${index + 1}\u20e3`); // React with number emoji
      });

      // Create a filter for reactions (only allow reactions from the message author)
      const filter = (reaction, user) => {
        return options
          .slice(0, 9)
          .some(
            (_, index) =>
              reaction.emoji.name === `${index + 1}\u20e3` &&
              user.id === message.author.id,
          );
      };

      // Create a collector to listen for reactions
      const collector = poll.createReactionCollector({ filter, time: 60000 }); // Collect reactions for 60 seconds

      // Initialize a map to store vote counts for each option
      const votes = new Map(
        options.slice(0, 9).map((_, index) => [index + 1, 0]),
      );

      // Listen for reactions and update vote counts
      collector.on("collect", (reaction) => {
        const index = parseInt(reaction.emoji.name, 10);
        votes.set(index, votes.get(index) + 1);
      });

      // Listen for the 'end' event to display poll results
      collector.on("end", () => {
        const resultsMessage =
          `Poll results for **${question}**\n\n` +
          options
            .slice(0, 9)
            .map(
              (option, index) =>
                `${index + 1}. ${option}: ${votes.get(index + 1)} votes`,
            )
            .join("\n");
        message.channel.send(resultsMessage);
      });
    });
  } else {
    // If not enough arguments are provided, notify the user
    sendMessage(
      message,
      "Please provide a question and at least two options for the poll.",
    );
  }
}

module.exports = commandActions;
