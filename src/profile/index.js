import { User } from "../model/userSchema.js";
export const getUserProfilesFromDatabase  = async (interaction) => {
    const user = interaction.options.getUser('user');
    
    if (!user) {
        return await interaction.reply({ content: 'User not specified!', ephemeral: true });
    }

    try {
        let profile = await User.findOne({ discordUserId: user.id });
        console.log(profile);

        if (!profile) {
            return await interaction.reply({
                content: `Profile for user <@${user.id}> doesn't exist!`,
                ephemeral: true
            });
        }

        let responseContent = `Profile for user <@${user.id}>:`;

        if (profile.chessComUsername) {
            const chessComLink = `https://www.chess.com/member/${profile.chessComUsername}`;
            responseContent += `\n- Chess.com profile: [${profile.chessComUsername}](${chessComLink})`;
        }

        if (profile.lichessUsername) {
            const lichessLink = `https://lichess.org/@/${profile.lichessUsername}`;
            responseContent += `\n- Lichess profile: [${profile.lichessUsername}](${lichessLink})`;
        }

        if (!profile.chessComUsername && !profile.lichessUsername) {
            responseContent += `\n- No Chess.com or Lichess profiles found.`;
        }

        await interaction.reply({
            content: responseContent,
            ephemeral: false
        });
    } catch (error) {
        console.error('Error handling profile command:', error);
        await interaction.reply({
            content: 'An error occurred while processing the profile.',
            ephemeral: true
        });
    }
}