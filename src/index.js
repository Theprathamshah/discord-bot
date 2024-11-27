
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv'
import { connectDB } from "./database/database.js";
import { verifyUserProfile } from "./verify/index.js";

dotenv.config();
connectDB()

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


client.on('messageCreate', message => {
    const lowerCaseMessage = message.content.toLowerCase();
    if(lowerCaseMessage.includes('good night') && message.author.bot === false) {
        message.react('🌜')
        message.reply('Good Night borski!');
    }
})

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()) return;
    
    if(interaction.commandName === 'ping') {
        try {
            console.log('Sending gifs!');
            await interaction.reply('Pong you!!')
            await interaction.channel.send('https://tenor.com/view/pong-gif-26462133')
        } catch (error) {
            console.error('Error sending GIF:', error)
        }
    }
    if (interaction.commandName === "verify") {
        await verifyUserProfile(interaction);
    }

    if(interaction.commandName == 'profile') {
        await interaction.reply(`Profile command was called`)
    }
    
})

client.login(`${process.env.BOT_TOKEN}`)
