const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

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


// =========================
// 👋 ترحيب بالصورة
// =========================
client.on("guildMemberAdd", async (member) => {

    const channel = member.guild.channels.cache.find(
        ch => ch.name === "🙋‍♂️丨الــتــرحــيــب・𝑤𝑒𝑙𝑐𝑜𝑚𝑒"
    );

    if (!channel) return;


    const canvas = createCanvas(1536, 864);
    const ctx = canvas.getContext("2d");


    // الخلفية
    const background = await loadImage("./welcome.png");

    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // صورة العضو بالمربع اليسار
    const avatar = await loadImage(
        member.user.displayAvatarURL({
            extension: "png",
            size: 512
        })
    );


    ctx.save();

    ctx.beginPath();

    ctx.arc(
        160,
        390,
        110,
        0,
        Math.PI * 2
    );

    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
        avatar,
        50,
        280,
        220,
        220
    );

    ctx.restore();


    // النص
    ctx.fillStyle = "#ffffff";


    ctx.font = "bold 55px Arial";

    ctx.fillText(
        "♥︎ Welcome to ANR2 COMMUNITY",
        430,
        330
    );


    ctx.font = "bold 42px Arial";

    ctx.fillText(
        `★ You Number ${member.guild.memberCount} ✨`,
        430,
        430
    );


    ctx.font = "36px Arial";

    ctx.fillText(
        "Act Like this place is your home",
        430,
        520
    );


    const attachment = new AttachmentBuilder(
        canvas.toBuffer(),
        {
            name: "welcome.png"
        }
    );


    channel.send({
        content: `🌊 ${member} 🌙`,
        files: [attachment]
    });
});


// =========================
// 👋 لوق دخول
// =========================
client.on("guildMemberAdd", async (member) => {

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
        .setFooter({ text: member.guild.name })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// 👋 لوق خروج
// =========================
client.on("guildMemberRemove", async (member) => {

    const logChannel = client.channels.cache.get("1428876173357875211");
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("📤 عضو خرج من السيرفر")
        .setColor("Grey")
        .addFields(
            { name: "👤 الاسم", value: member.user.tag, inline: true },
            { name: "🆔 الايدي", value: member.user.id, inline: true },
            { name: "👥 المتبقي", value: `${member.guild.memberCount}` }
        )
        .setFooter({ text: member.guild.name })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });

});


// =========================
// 🗑️ حذف روم
// =========================
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
                { name: "👤 المسؤول", value: `${executor}`, inline: true },
                { name: "🆔 الايدي", value: executor.id, inline: true },
                { name: "📂 الروم", value: channel.name }
            )
            .setFooter({ text: channel.guild.name })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    } catch (error) {
        console.log(error);
    }

});


// =========================
// ✏️ تعديل روم
// =========================
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
                { name: "👤 المسؤول", value: `${executor}`, inline: true },
                { name: "📂 قبل", value: oldChannel.name || "N/A", inline: true },
                { name: "📂 بعد", value: newChannel.name || "N/A", inline: true }
            )
            .setFooter({ text: newChannel.guild.name })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });

    } catch (error) {
        console.log(error);
    }

});


client.login(process.env.TOKEN);