const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});


// =====================
// 👋 ترحيب + دخول
// =====================
client.on("guildMemberAdd", async (member) => {

    // ترحيب
    const welcomeChannel = member.guild.channels.cache.find(
        ch => ch.name === "🙋‍♂️丨الــتــرحــيــب・𝑤𝑒𝑙𝑐𝑜𝑚𝑒"
    );

    if (welcomeChannel) {
        welcomeChannel.send(`♥︎ Welcome ${member}
★ You are member number ${member.guild.memberCount}`);
    }

    // لوق دخول
    const logChannel = client.channels.cache.get("1428876171411456145");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("📥 عضو دخل السيرفر")
        .setColor("Green")
        .addFields(
            { name: "👤 الاسم", value: member.user.tag, inline: true },
            { name: "🆔 الايدي", value: member.user.id, inline: true },
            { name: "👥 العدد", value: `${member.guild.memberCount}` }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});


// =====================
// 👋 خروج عضو
// =====================
client.on("guildMemberRemove", member => {
    const logChannel = client.channels.cache.get("1428876171411456145");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("📤 عضو خرج من السيرفر")
        .setColor("Grey")
        .addFields(
            { name: "👤 العضو", value: member.user.tag, inline: true },
            { name: "🆔 الايدي", value: member.user.id, inline: true },
            { name: "👥 المتبقي", value: `${member.guild.memberCount}` }
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});


// =====================
// 🗑️ حذف روم
// =====================
client.on("channelDelete", async (channel) => {
    const logChannel = client.channels.cache.get("1428876164574740501");
    if (!logChannel) return;

    try {
        const logs = await channel.guild.fetchAuditLogs({
            type: 12,
            limit: 1
        });

        const audit = logs.entries.first();
        if (!audit) return;

        const executor = audit.executor;

        const embed = new EmbedBuilder()
            .setTitle("🗑️ تم حذف روم")
            .setColor("Red")
            .addFields(
                { name: "👤 المسؤول", value: `${executor} (${executor.tag})` },
                { name: "🆔 الايدي", value: executor.id, inline: true },
                { name: "📂 الروم", value: channel.name, inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    } catch (error) {
        console.log(error);
    }
});


// =====================
// ✏️ تعديل روم
// =====================
client.on("channelUpdate", async (oldChannel, newChannel) => {
    const logChannel = client.channels.cache.get("1428876164574740501");
    if (!logChannel) return;

    try {
        const logs = await newChannel.guild.fetchAuditLogs({
            type: 11,
            limit: 1
        });

        const audit = logs.entries.first();
        if (!audit) return;

        const executor = audit.executor;

        const embed = new EmbedBuilder()
            .setTitle("✏️ تم تعديل روم")
            .setColor("Orange")
            .addFields(
                { name: "👤 المسؤول", value: `${executor} (${executor.tag})` },
                { name: "📂 قبل", value: oldChannel.name || "N/A", inline: true },
                { name: "📂 بعد", value: newChannel.name || "N/A", inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    } catch (error) {
        console.log(error);
    }
});


// =====================
// 🔑 تشغيل البوت
// =====================
client.login(process.env.TOKEN);