
export const getRoleName = (rating) => {
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

export const ensureRoleExists = async (guild, roleName, roleOptions = {}) => {
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