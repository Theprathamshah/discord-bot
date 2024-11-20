import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv'
dotenv.config();
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
        await interaction.deferReply();
    
        const username = interaction.options.getString("username");
        const platform = interaction.options.getString("platform");
        const discordUser = interaction.user;
        try {
            const chessData = await fetchChessProfile(username, platform);
    
            
            const { profileUserName, blitzRating, rapidRating } = chessData;
            if (!chessData.success || profileUserName!==discordUser.username) {
                console.log(`Error occured `, chessData);
                
                await interaction.editReply(chessData.message);
                return;
            }
            const highestRating = Math.max(blitzRating || 0, rapidRating || 0);
    
            const guild = interaction.guild;
            const member = guild.members.cache.get(discordUser.id);
    
            if (!member) {
                await interaction.editReply(
                    "Could not find the user in this server."
                );
                return;
            }
    
            const roleName = getRoleName(highestRating);
            const role = await ensureRoleExists(guild, roleName);
            const verifiedRole = await ensureRoleExists(guild, "Verified", {
                color: "GREEN",
                hoist: true,
            });
            await member.roles.add(verifiedRole);
            await member.roles.add(role);
    
            await interaction.editReply(
                `✅ User ${discordUser.username} successfully verified as "${profileUserName}" with a rating of ${highestRating} and assigned the roles: "Verified" and "${roleName}".`
            );
        } catch (error) {
            console.error("Error verifying or assigning role:", error);
    
            await interaction.editReply(
                "⚠️ Sorry, something went wrong. Please try again later."
            );
        }
    }
    
})

client.login(`${process.env.BOT_TOKEN}`)

console.log(`Bot has started`);


async function fetchChessProfile(username, platform) {
    if(platform === 'chess.com') {
        return fetchChessComProfile(username);
    }
    return fetchLichessProfile(username)
}

async function fetchChessComProfile(username) {
    const url = `https://api.chess.com/pub/player/${username}`;
    const statsUrl = `https://api.chess.com/pub/player/${username}/stats`;
    try {
        
        const profileResponse = await axios.get(url);
        const statsResponse = await axios.get(statsUrl);
        
        const profileData = profileResponse.data;
        const statsData = statsResponse.data;
        
        const chessComName = profileData.name;
        const blitzRating = statsData.chess_blitz?.last?.rating || 0;
        const rapidRating = statsData.chess_rapid?.last?.rating || 0;
        
        return {
            success: true,
            profileUserName: chessComName,
            blitzRating,
            rapidRating,
        };
    } catch (error) {
        console.error("Error fetching Chess.com data:", error);
        return {
            success: false,
            message: "Failed to fetch data from Chess.com. Please check the username and try again.",
        };
    }
}

async function fetchLichessProfile(username) {
    
    const url = `https://lichess.org/api/user/${username}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        const username = data.profile.realName;
        const blitzRating = data.perfs.blitz.rating;
        const rapidRating = data.perfs.rapid.rating;

        return {
            success: true,
            profileUserName: username,
            blitzRating,
            rapidRating,
        }
    } catch (error) {
        console.error("Error fetching Lichess.org data:", error);
        return {
            success: false,
            message: "Failed to fetch data from Lichess.org. Please check the username and try again.",
        };
    }
}

// Get role name based on rating
function getRoleName(rating) {
    if (rating >= 2800) return "Cheater";
    if (rating >= 2600) return "Academy Master";
    if (rating >= 2400) return "Advanced Expert";
    if (rating >= 2200) return "Expert";
    if (rating >= 2000) return "Pre Expert";
    if (rating >= 1800) return "Advanced Intermediate";
    if (rating >= 1600) return "Intermediate";
    if (rating >= 1400) return "Pre Intermediate";
    if (rating >= 1200) return "Novice";
    return "Beginner";
}

// Ensure a role exists
async function ensureRoleExists(guild, roleName, roleOptions = {}) {
    let role = guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    if (!role) {
        role = await guild.roles.create({
            name: roleName,
            ...roleOptions,
            reason: `Created role "${roleName}" for chess ratings.`,
        });
        console.log(`Created role: ${roleName}`);
    }
    return role;
}