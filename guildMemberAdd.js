const { AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");

module.exports = async (client, member) => {
    try {
        const channelId = "1498773103033978970";
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        // تحميل الخلفية
        const background = await Canvas.loadImage("https://media.discordapp.net/attachments/1457006310825660467/1500573799890948286/ChatGPT_Image_Apr_28_2026_10_34_45_PM-1.png");

        // تحميل صورة العضو
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png" }));

        // إنشاء الكانفس
        const canvas = Canvas.createCanvas(1024, 450);
        const ctx = canvas.getContext("2d");

        // رسم الخلفية
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // رسم صورة العضو داخل دائرة
        ctx.save();
        ctx.beginPath();
        ctx.arc(150, 225, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 50, 125, 200, 200);
        ctx.restore();

        // ============================
        // كتابة النص داخل المستطيل
        // ============================

        ctx.font = "bold 50px Sans";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        // مكان النص داخل المستطيل (عدّل الرقم إذا تبي)
        ctx.fillText("Welcome To ANR2 Community", 650, 120);

        // كتابة اسم العضو
        ctx.font = "40px Sans";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${member.user.username}`, 650, 200);

        // كتابة عدد الأعضاء
        ctx.font = "30px Sans";
        ctx.fillStyle = "#dddddd";
        ctx.fillText(`You are member #${member.guild.memberCount}`, 650, 260);

        // تجهيز الصورة للإرسال
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "welcome.png" });

        channel.send({ files: [attachment] });

    } catch (err) {
        console.error(err);
    }
};
