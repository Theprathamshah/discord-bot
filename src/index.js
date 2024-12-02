
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv'
import { connectDB } from "./database/database.js";
import { verifyUserProfile } from "./verify/index.js";
import { getUserProfilesFromDatabase } from "./profile/index.js";

dotenv.config();
connectDB()

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()) return;

    if (interaction.commandName === "verify") {
        await verifyUserProfile(interaction);
    }

    if (interaction.commandName === 'profile') {
        await getUserProfilesFromDatabase(interaction);
    }
})

client.login(`${process.env.BOT_TOKEN}`)
