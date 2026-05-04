
// ======================================================
// 📌 المتطلبات الأساسية
// ======================================================
const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    PermissionsBitField, 
    REST, 
    Routes 
} = require("discord.js");

const Canvas = require("@napi-rs/canvas");
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
const FOOTER = "𝐀𝐍𝐑𝟐 𝐒𝐲𝐬𝐭𝐞𝐦";
const COLOR = "#9b59b6";

// ======================================================
// 📊 نظام التحذيرات
// ======================================================
let warns = {};
if (fs.existsSync("./warns.json")) {
    warns = JSON.parse(fs.readFileSync("./warns.json"));
}
function saveWarns() {
    fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));
}

// ======================================================
// 🔐 الرتب الإدارية
// ======================================================
const ADMIN_ROLES = [
    "1448673238790963260",
    "1448677276559609906",
    "1483587014010863816",
    "1483476272133963797"
];

function hasRole(member) {
    return member?.roles?.cache?.some(r => ADMIN_ROLES.includes(r.id));
}
function isAdmin(member) {
    return member?.permissions?.has(PermissionsBitField.Flags.Administrator);
}

// ======================================================
// 🤖 تسجيل أوامر السلاش
// ======================================================
const commands = [
    {
        name: "ban",
        description: "حظر عضو",
        options: [{ name: "user", description: "العضو", type: 6, required: true }]
    },
    {
        name: "kick",
        description: "طرد عضو",
        options: [{ name: "user", description: "العضو", type: 6, required: true }]
    },
    {
        name: "warnings",
        description: "عرض تحذيرات عضو",
        options: [{ name: "user", description: "العضو", type: 6, required: false }]
    }
];

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

    console.log("Slash Commands Registered");
});

// ======================================================
// 🎯 تنفيذ أوامر السلاش (ردود متوسطة)
// ======================================================
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.member;

    // =======================
    // BAN
    // =======================
    if (interaction.commandName === "ban") {
        if (!isAdmin(member)) 
            return interaction.reply({ content: "❌ | ليس لديك صلاحية لتنفيذ هذا الأمر", ephemeral: true });

        const target = interaction.options.getMember("user");
        if (!target) return interaction.reply("❌ | العضو غير موجود");

        await target.ban();

        const embed = new EmbedBuilder()
            .setColor(COLOR)
            .setTitle("🔨 | تم تنفيذ عملية الحظر")
            .setDescription(`• العضو: **${target.user.tag}**\n• بواسطة: **${member.user.tag}**\n• الحالة: تمت العملية بنجاح`)
            .setFooter({ text: FOOTER })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }

    // =======================
    // KICK
    // =======================
    if (interaction.commandName === "kick") {
        if (!isAdmin(member)) 
            return interaction.reply({ content: "❌ | ليس لديك صلاحية لتنفيذ هذا الأمر", ephemeral: true });

        const target = interaction.options.getMember("user");
        if (!target) return interaction.reply("❌ | العضو غير موجود");

        await target.kick();

        const embed = new EmbedBuilder()
            .setColor(COLOR)
            .setTitle("👢 | تم تنفيذ عملية الطرد")
            .setDescription(`• العضو: **${target.user.tag}**\n• بواسطة: **${member.user.tag}**\n• الحالة: تمت العملية بنجاح`)
            .setFooter({ text: FOOTER })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }

    // =======================
    // WARNINGS
    // =======================
    if (interaction.commandName === "warnings") {
        const target = interaction.options.getMember("user") || member;
        const list = warns[target.id] || [];

        const embed = new EmbedBuilder()
            .setColor(COLOR)
            .setTitle("📄 | قائمة التحذيرات")
            .setDescription(list.length ? 
                list.map((w, i) => `**${i + 1}** - ${w.reason} (بواسطة ${w.by})`).join("\n") :
                "✔️ | لا توجد تحذيرات لهذا العضو")
            .setFooter({ text: FOOTER })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
});

// ======================================================
// 🎉 ترحيب بالصورة (Canvas)
// ======================================================
const WELCOME_CHANNEL = "1498773103033978970";
const backgroundURL = "https://media.discordapp.net/attachments/1457006310825660467/1498771157942276137/ChatGPT_Image_Apr_28_2026_10_34_45_PM.png?format=webp&quality=lossless";

client.on("guildMemberAdd", async (member) => {
    try {
        const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
        if (!channel) return;

        const canvas = Canvas.createCanvas(1000, 700);
        const ctx = canvas.getContext("2d");

        const bg = await Canvas.loadImage(backgroundURL);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 }));

        const x = 60, y = 150, w = 260, h = 260, r = 40;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, w, h);
        ctx.restore();

        ctx.font = "45px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(member.user.username, 380, 240);

        ctx.font = "40px Arial";
        ctx.fillStyle = "#00eaff";
        ctx.fillText("Welcome to ANR2Community", 380, 300);

        const attachment = { files: [{ attachment: canvas.toBuffer("image/png"), name: "welcome.png" }] };

        const msg = `
♥︎ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑨𝑵𝑹𝟐 𝑪𝑶𝑴𝑴𝑼𝑵𝑰𝑻𝒀 🌊 ${member}

★ 𝐘𝐨𝐮 𝐍𝐮𝐦𝐛𝐞𝐫 ${member.guild.memberCount} ✨️
𝐀𝐜𝐭 𝐋𝐢𝐤𝐞 𝐭𝐡𝐢𝐬 𝐩𝐥𝐚𝐜𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐡𝐨𝐦𝐞
        `;

        channel.send(msg);
        channel.send(attachment);

    } catch (err) {
        console.log(err);
    }
});

// ======================================================
// 📥 لوق دخول عضو (احترافي)
// ======================================================
client.on("guildMemberAdd", async (member) => {
    try {
        const ch = client.channels.cache.get("1428876171411456145");
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("📥 | دخول عضو جديد")
            .setColor(COLOR)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 العضو", value: `${member.user.tag}`, inline: true },
                { name: "🆔 ID", value: `${member.id}`, inline: true },
                { name: "📅 وقت الدخول", value: `<t:${Math.floor(Date.now()/1000)}:R>` }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });
    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// 📤 خروج عضو
// ======================================================
client.on("guildMemberRemove", async (member) => {
    try {
        const ch = client.channels.cache.get("1428876173357875211");
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("📤 | خروج عضو")
            .setColor("#e74c3c")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 العضو", value: `${member.user.tag}`, inline: true },
                { name: "🆔 ID", value: `${member.id}`, inline: true }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });
    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// 🎧 دخول/خروج فويس
// ======================================================
client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        const ch = client.channels.cache.get("1428876175345844294");
        if (!ch) return;

        const member = newState.member;

        const embed = new EmbedBuilder()
            .setColor(newState.channel ? "#3498db" : "#9b59b6")
            .setTitle(newState.channel ? "🎧 | دخول فويس" : "🚪 | خروج فويس")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 العضو", value: `${member.user.tag}`, inline: true },
                { name: "📡 القناة", value: `${newState.channel?.name || oldState.channel?.name}`, inline: true }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// 🗑️ حذف رسالة
// ======================================================
client.on("messageDelete", async (message) => {
    try {
        if (!message?.author || message.author.bot) return;

        const ch = client.channels.cache.get("1428876166982533180");
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("🗑️ | حذف رسالة")
            .setColor("#f1c40f")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 العضو", value: `${message.author.tag}`, inline: true },
                { name: "📍 القناة", value: `${message.channel}`, inline: true },
                { name: "💬 المحتوى", value: message.content || "بدون محتوى" }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// ✏️ تعديل رسالة
// ======================================================
client.on("messageUpdate", async (oldMsg, newMsg) => {
    try {
        if (!oldMsg?.author || oldMsg.author.bot) return;

        const ch = client.channels.cache.get("1428876168639021146");
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("✏️ | تعديل رسالة")
            .setColor("#8e44ad")
            .setThumbnail(oldMsg.author.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 العضو", value: `${oldMsg.author.tag}`, inline: true },
                { name: "قبل", value: oldMsg.content || "فارغ" },
                { name: "بعد", value: newMsg.content || "فارغ" }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// 🏗️ لوق الرومات (إنشاء – حذف – تعديل)
// ======================================================
const ROOM_LOG = "1428876164574740501";

// إنشاء روم
client.on("channelCreate", async (channel) => {
    try {
        const ch = client.channels.cache.get(ROOM_LOG);
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("📁 | تم إنشاء روم جديد")
            .setColor(COLOR)
            .addFields(
                { name: "📌 اسم الروم", value: `${channel.name}` },
                { name: "🆔 ID", value: `${channel.id}` },
                { name: "⚙️ النوع", value: `${channel.type}` }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// حذف روم
client.on("channelDelete", async (channel) => {
    try {
        const ch = client.channels.cache.get(ROOM_LOG);
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("🗑️ | تم حذف روم")
            .setColor("#e74c3c")
            .addFields(
                { name: "📌 اسم الروم", value: `${channel.name}` },
                { name: "🆔 ID", value: `${channel.id}` },
                { name: "⚙️ النوع", value: `${channel.type}` }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// تعديل روم
client.on("channelUpdate", async (oldCh, newCh) => {
    try {
        const ch = client.channels.cache.get(ROOM_LOG);
        if (!ch) return;

        const embed = new EmbedBuilder()
            .setTitle("✏️ | تم تعديل روم")
            .setColor("#f1c40f")
            .addFields(
                { name: "📌 الاسم القديم", value: `${oldCh.name}` },
                { name: "📌 الاسم الجديد", value: `${newCh.name}` },
                { name: "⚙️ النوع", value: `${newCh.type}` }
            )
            .setFooter({ text: FOOTER })
            .setTimestamp();

        ch.send({ embeds: [embed] });

    } catch (e) {
        console.log(e);
    }
});

// ======================================================
// 💬 أوامر البادئة (ردود متوسطة)
// ======================================================
client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;
        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const cmd = args.shift();
        const member = message.member;

        // =======================
        // مسح
        // =======================
        if (cmd === "مسح" || cmd === "م") {
            if (!hasRole(member)) return;

            const amount = parseInt(args[0]);
            if (!amount) return;

            await message.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor(COLOR)
                .setTitle("🧹 | تم مسح الرسائل")
                .setDescription(`• العدد: **${amount}**\n• بواسطة: **${member.user.tag}**`)
                .setFooter({ text: FOOTER })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }

        // =======================
        // تحذير
        // =======================
        if (cmd === "تحذير" || cmd === "ت") {
            if (!hasRole(member)) return;

            const target = message.mentions.members.first();
            const reason = args.slice(1).join(" ");
            if (!target || !reason) return;

            if (!warns[target.id]) warns[target.id] = [];
            warns[target.id].push({ reason, by: message.author.tag });
            saveWarns();

            const embed = new EmbedBuilder()
                .setColor("#e67e22")
                .setTitle("⚠️ | تم إصدار تحذير")
                .setDescription(`• العضو: **${target.user.tag}**
• السبب: **${reason}**
• بواسطة: **${member.user.tag}**`)
                .setFooter({ text: FOOTER })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }

        // =======================
        // قفل الروم -قفل / -ق
        // =======================
        if (cmd === "قفل" || cmd === "ق") {
            if (!isAdmin(member)) return;

            await message.channel.permissionOverwrites.edit(
                message.guild.id,
                { SendMessages: false }
            );

            const embed = new EmbedBuilder()
                .setColor("#e74c3c")
                .setTitle("🔒 | تم قفل الروم")
                .setDescription(`• تم منع إرسال الرسائل في هذا الروم
• بواسطة: **${member.user.tag}**`)
                .setFooter({ text: FOOTER })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }

        // =======================
        // فتح الروم -فتح / -ف
        // =======================
        if (cmd === "فتح" || cmd === "ف") {
            if (!isAdmin(member)) return;

            await message.channel.permissionOverwrites.edit(
                message.guild.id,
                { SendMessages: true }
            );

            const embed = new EmbedBuilder()
                .setColor("#2ecc71")
                .setTitle("🔓 | تم فتح الروم")
                .setDescription(`• تم السماح بإرسال الرسائل في هذا الروم
• بواسطة: **${member.user.tag}**`)
                .setFooter({ text: FOOTER })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }

    } catch (err) {
        console.error(err);
    }
}); // ← ← ← إغلاق الحدث كامل

client.login(process.env.TOKEN);

const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
});

server.listen(process.env.PORT || 3000);
