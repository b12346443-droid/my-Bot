const { EmbedBuilder } = require("discord.js");
const { ADMIN_ROLE, MOD_ROLES } = require("../utils/roles");
const warns = require("../utils/warns.json");
const saveWarns = require("../utils/saveWarns");

function hasMod(member) {
    return member.roles.cache.some(r => MOD_ROLES.includes(r.id));
}

function hasAdmin(member) {
    return member.roles.cache.has(ADMIN_ROLE);
}

module.exports = {
    name: "moderation",

    // ============================
    // أوامر البرفكس
    // ============================
    async prefix(client, message, cmd, args) {
        const member = message.member;

        // -تايم
        if (cmd === "تايم") {
            if (!hasMod(member)) return;

            const target = message.mentions.members.first();
            const duration = parseInt(args[1]);
            const reason = args.slice(2).join(" ") || "بدون سبب";

            if (!target || !duration) return;

            await target.timeout(duration * 1000, reason);
            message.channel.send(`⏳ | تم إعطاء **${target.user.tag}** تايم لمدة **${duration} ثانية**`);
        }

        // -شيل
        if (cmd === "شيل") {
            if (!hasMod(member)) return;

            const target = message.mentions.members.first();
            if (!target) return;

            await target.timeout(null);
            message.channel.send(`✅ | تم إزالة التايم عن **${target.user.tag}**`);
        }

        // -تحذير
        if (cmd === "تحذير") {
            if (!hasMod(member)) return;

            const target = message.mentions.members.first();
            const reason = args.slice(1).join(" ");
            if (!target || !reason) return;

            if (!warns[target.id]) warns[target.id] = [];
            warns[target.id].push({ reason, by: message.author.tag });
            saveWarns();

            message.channel.send(`⚠️ | تم تحذير **${target.user.tag}**`);
        }

        // -مسح
        if (cmd === "مسح") {
            if (!hasMod(member)) return;

            const amount = parseInt(args[0]);
            if (!amount) return;

            await message.channel.bulkDelete(amount, true);
            message.channel.send(`🧹 | تم مسح **${amount}** رسالة`);
        }

        // -قفل
        if (cmd === "قفل") {
            if (!hasAdmin(member)) return;

            await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
            message.channel.send("🔒 | تم قفل الروم");
        }

        // -فتح
        if (cmd === "فتح") {
            if (!hasAdmin(member)) return;

            await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true });
            message.channel.send("🔓 | تم فتح الروم");
        }
    },

    // ============================
    // أوامر السلاش
    // ============================
    async slash(client, interaction) {
        const member = interaction.member;

        // /تايم
        if (interaction.commandName === "تايم") {
            if (!hasMod(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const target = interaction.options.getMember("العضو");
            const duration = interaction.options.getInteger("المدة");
            const reason = interaction.options.getString("السبب") || "بدون سبب";

            await target.timeout(duration * 1000, reason);
            interaction.reply(`⏳ | تم إعطاء **${target.user.tag}** تايم لمدة **${duration} ثانية**`);
        }

        // /تحذير
        if (interaction.commandName === "تحذير") {
            if (!hasMod(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const target = interaction.options.getMember("العضو");
            const reason = interaction.options.getString("السبب");

            if (!warns[target.id]) warns[target.id] = [];
            warns[target.id].push({ reason, by: interaction.user.tag });
            saveWarns();

            interaction.reply(`⚠️ | تم تحذير **${target.user.tag}**`);
        }

        // /مسح
        if (interaction.commandName === "مسح") {
            if (!hasMod(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const amount = interaction.options.getInteger("العدد");
            await interaction.channel.bulkDelete(amount, true);

            interaction.reply(`🧹 | تم مسح **${amount}** رسالة`);
        }

        // /قفل
        if (interaction.commandName === "قفل") {
            if (!hasAdmin(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
            interaction.reply("🔒 | تم قفل الروم");
        }

        // /فتح
        if (interaction.commandName === "فتح") {
            if (!hasAdmin(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });
            interaction.reply("🔓 | تم فتح الروم");
        }

        // /كيك
        if (interaction.commandName === "كيك") {
            if (!hasMod(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const target = interaction.options.getMember("العضو");
            const reason = interaction.options.getString("السبب") || "بدون سبب";

            await target.kick(reason);
            interaction.reply(`👢 | تم طرد **${target.user.tag}**`);
        }

        // /بان
        if (interaction.commandName === "بان") {
            if (!hasAdmin(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const target = interaction.options.getMember("العضو");
            const reason = interaction.options.getString("السبب") || "بدون سبب";

            await target.ban({ reason });
            interaction.reply(`⛔ | تم حظر **${target.user.tag}**`);
        }

        // /شيل_التايم
        if (interaction.commandName === "شيل_التايم") {
            if (!hasMod(member)) return interaction.reply({ content: "❌ | ما عندك صلاحية.", ephemeral: true });

            const target = interaction.options.getMember("العضو");

            await target.timeout(null);
            interaction.reply(`✅ | تم إزالة التايم عن **${target.user.tag}**`);
        }
    }
};
