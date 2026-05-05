const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "تايم",
        description: "إعطاء تايم أوت لعضو",
        options: [
            {
                name: "العضو",
                description: "الشخص الذي تريد إعطاءه تايم",
                type: 6,
                required: true
            },
            {
                name: "المدة",
                description: "المدة بالثواني",
                type: 4,
                required: true
            },
            {
                name: "السبب",
                description: "سبب التايم",
                type: 3,
                required: false
            }
        ]
    },
    {
        name: "شيل_التايم",
        description: "إزالة التايم أوت عن عضو",
        options: [
            {
                name: "العضو",
                description: "الشخص الذي تريد إزالة التايم عنه",
                type: 6,
                required: true
            }
        ]
    },
    {
        name: "تحذير",
        description: "إعطاء تحذير لعضو",
        options: [
            {
                name: "العضو",
                description: "الشخص الذي تريد تحذيره",
                type: 6,
                required: true
            },
            {
                name: "السبب",
                description: "سبب التحذير",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "مسح",
        description: "مسح عدد من الرسائل",
        options: [
            {
                name: "العدد",
                description: "عدد الرسائل",
                type: 4,
                required: true
            }
        ]
    },
    {
        name: "قفل",
        description: "قفل الروم الحالي"
    },
    {
        name: "فتح",
        description: "فتح الروم الحالي"
    },
    {
        name: "كيك",
        description: "طرد عضو",
        options: [
            {
                name: "العضو",
                description: "الشخص الذي تريد طرده",
                type: 6,
                required: true
            },
            {
                name: "السبب",
                description: "سبب الطرد",
                type: 3,
                required: false
            }
        ]
    },
    {
        name: "بان",
        description: "حظر عضو",
        options: [
            {
                name: "العضو",
                description: "الشخص الذي تريد حظره",
                type: 6,
                required: true
            },
            {
                name: "السبب",
                description: "سبب الحظر",
                type: 3,
                required: false
            }
        ]
    }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("⏳ جاري تسجيل أوامر السلاش...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ تم تسجيل أوامر السلاش بنجاح!");
    } catch (err) {
        console.error(err);
    }
})();
