require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const express = require("express");

// ===============================
// 0) تشغيل Web Server لمنع Railway من إيقاف البوت
// ===============================
const app = express();

app.get("/", (req, res) => res.send("Bot is running"));
app.get("/disable", (req, res) => res.send("OK"));

app.listen(process.env.PORT || 3000, () => {
    console.log("🌐 Web server started");
});

// ===============================
// 1) حذف أوامر السلاش القديمة
// ===============================
(async () => {
    try {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        console.log("🗑️ جاري حذف أوامر السلاش القديمة...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );

        console.log("🗑️ تم حذف كل أوامر السلاش!");
    } catch (err) {
        console.error(err);
    }
})();

// ===============================
// 2) تسجيل أوامر السلاش الجديدة
// ===============================
const commands = [
    {
        name: "تايم",
        description: "إعطاء تايم أوت لعضو",
        options: [
            {
                name: "العضو",
                type: 6,
                required: true,
                description: "اختر العضو"
            },
            {
                name: "المدة",
                type: 4,
                required: true,
                description: "المدة بالثواني"
            },
            {
                name: "السبب",
                type: 3,
                required: false,
                description: "سبب التايم أوت"
            }
        ]
    }
];

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
// 3) تشغيل البوت
// ===============================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ===============================
// 4) تنفيذ أمر /تايم
// ===============================
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "تايم") {
        const member = interaction.options.getMember("العضو");
        const duration = interaction.options.getInteger("المدة");
        const reason = interaction.options.getString("السبب") || "بدون سبب";

        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ لا يمكن إعطاء تايم لهذا العضو.",
                ephemeral: true
            });
        }

        try {
            await member.timeout(duration * 1000, reason);

            await interaction.reply(
                `⏳ تم إعطاء تايم لـ ${member} لمدة **${duration} ثانية**.\nالسبب: ${reason}`
            );
        } catch (err) {
            console.error(err);
            await interaction.reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
        }
    }
});

// ===============================
// 5) تسجيل الدخول
// ===============================
client.login(process.env.TOKEN);