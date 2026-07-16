const fs = require('fs');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');
const { Client, GatewayIntentBits, Events, Collection, ActivityType } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Set up default prefix and other variables
const DEFAULT_PREFIX = 'somuy';
client.prefix = DEFAULT_PREFIX;

const prefixesPath = path.join(__dirname, 'database/prefixes.json');
const activeCommandFiles = [
    'balance',
    'choose',
    'coinflip',
    'define',
    'duel',
    'give',
    'guess',
    'help',
    'ping',
    'prefix',
    'profile',
    'roll',
    'slotbattle',
    'slots',
    'translate',
    'addmoney',
    'takemoney',
    'setmoney'
];

// Load the prefixes from file
let prefixes = {};
if (fs.existsSync(prefixesPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf-8'));
}
client.prefixes = prefixes;

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const baseName = path.basename(file, '.js');
    if (!activeCommandFiles.includes(baseName)) continue;

    const commands = require(`./commands/${file}`);
    if (Array.isArray(commands)) {
        for (const command of commands) {
            client.commands.set(command.name, command);
        }
    } else {
        client.commands.set(commands.name, commands);
    }
}

connectDB();
// Event: Bot is ready
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const serverCount = client.guilds.cache.size;
    client.user.setActivity(`somuy help • ${serverCount} servers`, {
        type: ActivityType.Playing,
    });
});

// Event: Message is received
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const guildId = message.guild?.id;
    const prefix = (guildId && client.prefixes[guildId]) || client.prefix;
    const prefixText = prefix.toLowerCase();
    const content = message.content.trim();

    if (content.toLowerCase().startsWith(prefixText)) {
        const args = content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;
        if (!client.commands.has(commandName)) {
            return message.reply(`Unknown command. Try \`${prefix} help\` for the list.`);
        }

        const command = client.commands.get(commandName);
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply(`Something went wrong while running that command. Try \`${prefix} help\` if you need help.`);
        }
    }

    if (message.mentions.has(client.user)) {
        message.reply(`Halo! Prefix-ku sekarang adalah \`${prefix}\``);
    }
});

// Log in to Discord with your app's token
client.login(process.env.TOKEN);
