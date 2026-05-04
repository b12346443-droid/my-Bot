const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});


// =========================
// 👋 دخول السيرفر
// =========================
client.on("guildMemberAdd", async (member) => {

    const logChannel = client.channels.cache.get("1428876171411456145");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("📥 عضو دخل السيرفر")
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: "👤 العضو", value: `${member.user}`, inline: true },
            { name: "🆔 الايدي", value: member.user.id, inline: true },
            { name: "👥 العدد", value: `${member.guild.memberCount}` }
        )
        .setFooter({ text: member.guild.name })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// 👋 خروج السيرفر
// =========================
client.on("guildMemberRemove", async (member) => {

    const logChannel = client.channels.cache.get("1428876173357875211");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("📤 عضو خرج من السيرفر")
        .setColor("Grey")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: "👤 العضو", value: `${member.user}`, inline: true },
            { name: "🆔 الايدي", value: member.user.id, inline: true },
            { name: "👥 المتبقي", value: `${member.guild.memberCount}` }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// 🎧 فويس
// =========================
client.on("voiceStateUpdate", async (oldState, newState) => {

    const logChannel = client.channels.cache.get("1428876175345844294");
    if (!logChannel) return;

    const member = newState.member || oldState.member;

    if (!oldState.channel && newState.channel) {

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎧 دخول فويس")
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: "👤 العضو", value: `${member.user}`, inline: true },
                { name: "🎙️ الروم", value: `${newState.channel}`, inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    }

    if (oldState.channel && !newState.channel) {

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🚪 خروج من فويس")
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: "👤 العضو", value: `${member.user}`, inline: true },
                { name: "🎙️ الروم", value: `${oldState.channel}`, inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    }

});


// =========================
// 🗑️ حذف رسالة
// =========================
client.on("messageDelete", async (message) => {

    if (!message.author || message.author.bot) return;

    const logChannel = client.channels.cache.get("1428876166982533180");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🗑️ حذف رسالة")
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: "👤 العضو", value: `${message.author}` },
            { name: "📂 الروم", value: `${message.channel}` },
            { name: "💬 الرسالة", value: message.content || "بدون محتوى" }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// ✏️ تعديل رسالة
// =========================
client.on("messageUpdate", async (oldMessage, newMessage) => {

    if (!oldMessage.author || oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const logChannel = client.channels.cache.get("1428876168639021146");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("✏️ تعديل رسالة")
        .setThumbnail(oldMessage.author.displayAvatarURL())
        .addFields(
            { name: "👤 العضو", value: `${oldMessage.author}` },
            { name: "📜 قبل", value: oldMessage.content || "فارغ" },
            { name: "📜 بعد", value: newMessage.content || "فارغ" }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// ⏳ تايم اوت + 🎖️ رتب
// =========================
client.on("guildMemberUpdate", async (oldMember, newMember) => {

    // تايم
    if (!oldMember.communicationDisabledUntil &&
        newMember.communicationDisabledUntil) {

        const timeLog = client.channels.cache.get("1428876162645495810");

        if (timeLog) {

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("⏳ تايم أوت")
                .addFields(
                    { name: "👤 العضو", value: `${newMember.user}` }
                )
                .setTimestamp();

            timeLog.send({ embeds: [embed] });

        }

    }

    // رتب
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {

        const roleLog = client.channels.cache.get("1428876165690560512");

        if (roleLog) {

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("🎖️ تعديل رتب")
                .addFields(
                    { name: "👤 العضو", value: `${newMember.user}` }
                )
                .setTimestamp();

            roleLog.send({ embeds: [embed] });

        }

    }

});


// =========================
// 🗑️ حذف روم
// =========================
client.on("channelDelete", async (channel) => {

    const logChannel = client.channels.cache.get("1428876164574740501");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("🗑️ حذف روم")
        .setColor("Red")
        .addFields(
            { name: "📂 الروم", value: channel.name }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// ✏️ تعديل روم
// =========================
client.on("channelUpdate", async (oldChannel, newChannel) => {

    const logChannel = client.channels.cache.get("1428876164574740501");
    if (!logChannel) return;

    if (oldChannel.name === newChannel.name) return;

    const embed = new EmbedBuilder()
        .setTitle("✏️ تعديل روم")
        .setColor("Orange")
        .addFields(
            { name: "📂 قبل", value: oldChannel.name },
            { name: "📂 بعد", value: newChannel.name }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// 👢 كيك
// =========================
client.on("guildMemberRemove", async (member) => {

    setTimeout(async () => {

        const logChannel = client.channels.cache.get("1428876170145042494");
        if (!logChannel) return;

        try {

            const logs = await member.guild.fetchAuditLogs({
                type: 20,
                limit: 1
            });

            const audit = logs.entries.first();
            if (!audit) return;

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("👢 طرد عضو")
                .addFields(
                    { name: "👤 العضو", value: `${member.user}` },
                    { name: "🛡️ المسؤول", value: `${audit.executor}` }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });

        } catch {}

    }, 1000);

});


// =========================
// 🔨 بان
// =========================
client.on("guildBanAdd", async (ban) => {

    const logChannel = ban.guild.channels.cache.get("1428876161038942328");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🔨 بان عضو")
        .addFields(
            { name: "👤 العضو", value: `${ban.user}` }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// ✅ فك بان
// =========================
client.on("guildBanRemove", async (ban) => {

    const logChannel = ban.guild.channels.cache.get("1428876161038942328");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ فك بان")
        .addFields(
            { name: "👤 العضو", value: `${ban.user}` }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


client.login(process.env.TOKEN);