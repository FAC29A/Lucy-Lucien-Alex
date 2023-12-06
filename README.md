![Alt text](BenderConversation.gif)

# Custom commands

- `!ping`: Replies with "Pong!" to check if the bot is responsive.
- `!hello`: Greets the user with a friendly "Hi there!".
- `!joke`: Shares a random joke from the bot's collection.
- `!echo`: Repeats the user's message, excluding the "!echo" command.
- `!history`: Sends the chat history stored by the bot.
- `!ask`: Engages in a conversation with the OpenAI GPT-3.5 Turbo model.
- `!help`: Displays a list of available commands based on the channel type.
- `!poll`: Conducts a poll based on user-provided options. Example usage:`!poll [question] [option1] [option2] ...`.The bot will be able to tally votes and display results.
- `!myid` (_DM exclusive_): Sends the user's Discord ID in a DM.

Description of what is happening in the images:

_in DM_

<img width="530" alt="Screenshot 2023-12-06 at 10 26 07" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/93b7e073-f263-45ea-b061-24c70cd7f485">

_in public channel_

<img width="767" alt="Screenshot 2023-12-06 at 10 27 19" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/e1770f45-89d8-4739-aa21-c200938ef81d">

---

### Conversation History

When a user begins a conversation with our bot by using the `!ask` command or by tagging it, our bot begin to log all conversation history that can later be accessed on demand. Our history gets logged in two different ways:

- **Locally:** The `history` function handles the **Command Logging**. This gets logged localy in `history.js`.
- **OpenAI API storage:** By using and accessing the ChatGPT API, the user can ask the bot for a complete conversation history.

We chose to implement both options for texting / debugging purposes. We handled the local history to aid with our bot building, particularly commands. OpenAI API's storage is more powerful, and will be the preferred logging method once the Bot is fully operational.

# Use of OpenAI API

When starting a conversation the bot (using the command `!ask`, tagging the bot or just having a private conversation), the bot will try to guess the name of the user who summoned it by using their Discord username. If the real name is not present on the Discord username it will just ommit it.
We infused our bot with the personality of Bender, the character from the serie Futurama, all his answers will be given using this specific tone.
To interact with the bot in this way just use natural language, like a regular conversation.

# Handling mentions

The bot can detect when it is mentioned by recognising its own user ID in a message, and will answer accordingly.

`@botId commandKeyword` is treated as if the user types `!commandKeyword`

# DM Functionality

The bot will recognise when a message is a direct message (DM) as opposed to a public channel message. This will enable the bot:

- Respond appropriately based on the context of the message in DMs.

- Regular command and DM-exlusive command are accessible in DMs.

- Users with admin permissions can use proactively send DM messages to all members on the server. To respect user privacy and server setting, the bot will check user privacy setting before sending out DM message. In the same time, each member's DM permission setting will be render in the terminal when using proactive DM sending.

- The bot provides a response regarding user's information only in DMs (i.e !userid to obtain user ID); Whereas on public channel, the commands associate with user's information are diabled. In the case of using `!help`, the bot will respond the avaialbe commands for the specific channel type (Dms or public channel)

- When adding the flag `-f` to a command the bot will send a DM to the author asking for feedback. The bot will wait up to 20 seconds for a response and log it as the feedback, after that period the window for receiving feedback will close.

- On each channel type, if entered a wrong command, the bot will answer with a list of available commands for that specific channel.

# Technical details

### Error Handling

We encapsulated all the async code on **`try...catch`** to manage exceptions or error, we customised error messages corresponding each steps. This is an example of our code:

```javaScript
if (userPrivacySettings.allowDMs) {
                    // Send a DM with the specified message
                    try {
                        await fetchedMember.send(
                            `${message.author.tag} says: ${notifyMessage}`)

                        // Log the allowDMs permission for the member
                        console.log(
                            `Sent DM to ${fetchedMember.user.tag}. allowDMs: ${userPrivacySettings.allowDMs}`)

                    } catch (error) {
                        console.error(
                            `Failed to send DM to ${member.user.tag}: ${error.message}`)
                    }
                } else {
                    console.log(
                        `User ${fetchedMember.user.tag} has disabled direct messages.`)
                }
            } catch (error) {
                console.error(
                    `Failed fetch member ${member.user.tag}: ${error.message}`)
            }

    } catch (error) {
        console.error(
            `Error fetching target channel (${targetChannelId}): ${error.message}`)
    }

```

![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)

# Running the Bot on a Raspberry PI.

## Install pm2 globally using npm:

```bash
sudo npm install pm2 -g
```

## Running Your Bot with pm2

Start your bot with pm2 by navigating to your bot's directory and running:

```bash
pm2 start script.js --name discord-bot
```

Replace script.js with the main file of your Discord bot. The --name flag is optional and helps you identify your process easily.

## Managing Your Bot

To check the status of your bot, use:

```bash
pm2 status
```

To view detailed logs of your bot:

```bash
pm2 logs discord-bot
```

To restart your bot:

```bash
pm2 restart discord-bot
```

To stop your bot:

```bash
pm2 stop discord-bot
```

## Setting Up pm2 to Start on Boot

To make sure your bot starts automatically after a reboot, use the following command:

```bash
pm2 startup
```

This command will generate a line that you need to copy and run in the terminal. It sets up a script that will start pm2 with your saved processes on boot.

After setting up the startup script, save the current list of processes:

```bash
pm2 save
```

Now, your bot should continue running even after closing the PuTTY session, and it will automatically start after the Raspberry Pi reboots.
