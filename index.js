const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");

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

const PREFIX = "-";

// =========================
// 📊 تحذيرات (حفظ دائم)
// =========================
let warns = {};
if (fs.existsSync("./warns.json")) {
    warns = JSON.parse(fs.readFileSync("./warns.json"));
}

function saveWarns() {
    fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));
}

// =========================
// 🔐 الرتب
// =========================
const ADMIN_ROLES = [
    "1448673238790963260",
    "1448677276559609906",
    "1483587014010863816",
    "1483476272133963797"
];

function hasRole(member) {
    return member.roles.cache.some(r => ADMIN_ROLES.includes(r.id));
}

function isAdmin(member) {
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

// =========================
// 🤖 تشغيل
// =========================
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// =========================
// 👋 دخول سيرفر
// =========================
client.on("guildMemberAdd", async (member) => {

    const ch = client.channels.cache.get("1428876171411456145");
    if (!ch) return;

    const embed = new EmbedBuilder()
        .setTitle("📥 دخول عضو")
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: "👤", value: `${member.user}` },
            { name: "👥 العدد", value: `${member.guild.memberCount}` }
        );

    ch.send({ embeds: [embed] });
});

// =========================
// 👋 خروج سيرفر
// =========================
client.on("guildMemberRemove", async (member) => {

    const ch = client.channels.cache.get("1428876173357875211");
    if (!ch) return;

    const embed = new EmbedBuilder()
        .setTitle("📤 خروج عضو")
        .setColor("Grey")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: "👤", value: `${member.user}` },
            { name: "👥 المتبقي", value: `${member.guild.memberCount}` }
        );

    ch.send({ embeds: [embed] });
});

// =========================
// 🎧 فويس
// =========================
client.on("voiceStateUpdate", async (oldState, newState) => {

    const ch = client.channels.cache.get("1428876175345844294");
    if (!ch) return;

    const member = newState.member;

    if (!oldState.channel && newState.channel) {

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎧 دخول فويس")
            .addFields(
                { name: "👤", value: `${member.user}` },
                { name: "🎙️ روم", value: `${newState.channel}` }
            );

        ch.send({ embeds: [embed] });
    }

    if (oldState.channel && !newState.channel) {

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🚪 خروج فويس")
            .addFields(
                { name: "👤", value: `${member.user}` },
                { name: "🎙️ روم", value: `${oldState.channel}` }
            );

        ch.send({ embeds: [embed] });
    }
});

// =========================
// 🗑️ حذف رسالة
// =========================
client.on("messageDelete", async (message) => {

    if (!message.author || message.author.bot) return;

    const ch = client.channels.cache.get("1428876166982533180");
    if (!ch) return;

    ch.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("🗑️ حذف رسالة")
                .setColor("Red")
                .addFields(
                    { name: "👤", value: `${message.author}` },
                    { name: "💬", value: message.content || "بدون" }
                )
        ]
    });
});

// =========================
// ✏️ تعديل رسالة
// =========================
client.on("messageUpdate", async (oldMsg, newMsg) => {

    if (!oldMsg.author || oldMsg.author.bot) return;

    const ch = client.channels.cache.get("1428876168639021146");
    if (!ch) return;

    ch.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("✏️ تعديل رسالة")
                .setColor("Orange")
                .addFields(
                    { name: "قبل", value: oldMsg.content || "فارغ" },
                    { name: "بعد", value: newMsg.content || "فارغ" }
                )
        ]
    });
});

// =========================
// 🧹 أوامر + إدارة
// =========================
client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift();

    const member = message.member;

    // 🧹 مسح
    if (cmd === "مسح" || cmd === "م") {
        if (!hasRole(member)) return;

        const amount = parseInt(args[0]);
        if (!amount) return;

        message.channel.bulkDelete(amount);
    }

    // ⚠️ تحذير
    if (cmd === "تحذير" || cmd === "ت") {

        if (!hasRole(member)) return;

        const target = message.mentions.members.first();
        const reason = args.slice(1).join(" ");

        if (!target || !reason) return;

        if (!warns[target.id]) warns[target.id] = [];

        warns[target.id].push({
            reason,
            by: message.author.tag
        });

        saveWarns();

        message.channel.send(`⚠️ تم تحذير ${target.user.tag}`);
    }

    // 📜 تحذيرات
    if (cmd === "التحذيرات" || cmd === "تت") {

        const target = message.mentions.members.first() || member;

        const list = warns[target.id] || [];

        if (!list.length) return message.reply("ما عنده تحذيرات");

        message.channel.send(
            list.map((w, i) => `${i + 1}- ${w.reason}`).join("\n")
        );
    }

    // 🗑️ حذف تحذير
    if (cmd === "تح" || cmd === "ازاله") {

        if (!hasRole(member)) return;

        const target = message.mentions.members.first();
        if (!target) return;

        warns[target.id] = [];

        saveWarns();

        message.channel.send("🗑️ تم الحذف");
    }

    // 🎖️ رول
    if (cmd === "رول") {

        if (!isAdmin(member)) return;

        const target = message.mentions.members.first();
        const role = message.mentions.roles.first();

        if (!target || !role) return;

        target.roles.add(role);

        message.channel.send("🎖️ تم إعطاء رتبة");
    }

    // 👢 كيك
    if (["كيك", "طرد", "برا"].includes(cmd)) {

        if (!isAdmin(member)) return;

        const target = message.mentions.members.first();
        if (!target) return;

        target.kick();

        message.channel.send("👢 تم الطرد");
    }

    // 🔨 بان
    if (["الصومال", "فرنسا", "بنعالي", "الهند"].includes(cmd)) {

        if (!isAdmin(member)) return;

        const target = message.mentions.members.first();
        if (!target) return;

        target.ban();

        message.channel.send("🔨 تم البان");
    }

});

// =========================
// تشغيل
// =========================
client.login(process.env.TOKEN);