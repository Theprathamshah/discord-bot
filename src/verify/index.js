import {getRoleName, ensureRoleExists } from '../utils/rolesUtil.js'
import { fetchChessProfile } from '../utils/fetchProfile.js';

export const verifyUserProfile = async (interaction) => {
  await interaction.deferReply();

  const username = interaction.options.getString("username");
  const platform = interaction.options.getString("platform");
  const discordUser = interaction.user;
  try {
    const chessData = await fetchChessProfile(username, platform);

    const { profileUserName, blitzRating, rapidRating } = chessData;
    if (!chessData.success || profileUserName !== discordUser.username) {
      console.log(`Error occured `, chessData);

      await interaction.editReply(chessData.message);
      return;
    }
    const highestRating = Math.max(blitzRating || 0, rapidRating || 0);

    const guild = interaction.guild;
    const member = guild.members.cache.get(discordUser.id);

    if (!member) {
      await interaction.editReply("Could not find the user in this server.");
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
};
