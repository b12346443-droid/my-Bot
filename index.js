require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const express = require("express");
const fs = require("fs");

// ===============================
// 0) Web Server لمنع الإيقاف
// ===============================
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000, () => {
    console.log("🌐 Web server started");
});

// ===============================
// 1) تسجيل أوامر السلاش
// ===============================

const commands = [
    {
        name: "تايم",
        description: "إعطاء تايم أوت لعضو",
        options: [
            { name: "العضو", type: 6, required: true, description: "اختر العضو" },
            { name: "المدة", type: 4, required: true, description: "المدة بالثواني" },
            { name: "السبب", type: 3, required: false, description: "سبب التايم أوت" }
        ]
    },
    {
        name: "تحذير",
        description: "إعطاء تحذير لعضو",
        options: [
            { name: "العضو", type: 6, required: true, description: "اختر العضو" },
            { name: "السبب", type: 3, required: true, description: "سبب التحذير" }
        ]
    },
    {
        name: "مسح",
        description: "مسح عدد من الرسائل",
        options: [
            { name: "العدد", type: 4, required: true, description: "عدد الرسائل" }
        ]
    },
    { name: "قفل", description: "قفل الروم" },
    { name: "فتح", description: "فتح الروم" },
    {
        name: "كيك",
        description: "طرد عضو",
        options: [
            { name: "العضو", type: 6, required: true, description: "اختر العضو" },
            { name: "السبب", type: 3, required: false, description: "سبب الطرد" }
        ]
    },
    {
        name: "بان",
        description: "حظر عضو",
        options: [
            { name: "العضو", type: 6, required: true, description: "اختر العضو" },
            { name: "السبب", type: 3, required: false, description: "سبب الحظر" }
        ]
    }
];

// تسجيل السلاش
(async () => {
    try {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        console.log("⚙️ جاري تسجيل أوامر السلاش...");
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log("✅ تم تسجيل أوامر السلاش!");
    } catch (err) {
        console.error(err);
    }
})();

// ===============================
// 2) تشغيل البوت
// ===============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ===============================
// 3) تحميل جميع ملفات events
// ===============================
fs.readdirSync("./events").forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.replace(".js", "");
    client.on(eventName, (...args) => event(client, ...args));
    console.log(`📌 Event Loaded: ${eventName}`);
});

// ===============================
// 4) تسجيل الدخول
// ===============================
client.login(process.env.TOKEN);
