const { EmbedBuilder } = require("discord.js");

module.exports = async (client, member) => {
    try {
        const channelId = "1498773103033978970";
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        const welcomeImage = "https://media.discordapp.net/attachments/1457006310825660467/1500573799890948286/ChatGPT_Image_Apr_28_2026_10_34_45_PM-1.png";

        const embed = new EmbedBuilder()
            .setColor("#2ecc71")
            .setTitle("Welcome to ANR2 Community")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage(welcomeImage)
            .setDescription(`
♥︎ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑨𝑵𝑹𝟐 𝑪𝑶𝑴𝑴𝑼𝑵𝑰𝑻𝒀 🌊 <@${member.id}>  

★ 𝐘𝐨𝐮 𝐍𝐮𝐦𝐛𝐞𝐫 **${member.guild.memberCount}** ✨️  
𝐀𝐜𝐭 𝐋𝐢𝐤𝐞 𝐭𝐡𝐢𝐬 𝐩𝐥𝐚𝐜𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐡𝐨𝐦𝐞
            `)
            .setFooter({ text: "ANR2 System" })
            .setTimestamp();

        channel.send({ embeds: [embed] });

    } catch (err) {
        console.error(err);
    }
};
