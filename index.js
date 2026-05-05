require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST, Routes } = require("discord.js");

// ===============================
// 0) حذف أوامر السلاش القديمة
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
// 1) تسجيل أوامر السلاش الجديدة
// ===============================

const commands = [
    {
        name: "تايم",
        description: "إعطاء تايم أوت لعضو",
        options: [
            { name: "العضو", type: 6, required: true, description: "العضو" },
            { name: "المدة", type: 4, required: true, description: "المدة بالثواني" },
            { name: "السبب", type: 3, required