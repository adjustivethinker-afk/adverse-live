import { PrismaClient, QuizCategory } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AdVerse Live...");

  // --- Settings ---
  await prisma.setting.upsert({
    where: { key: "platform" },
    update: {
      value: {
        welcomeBonus: 10,
        dailyQuizReward: 30,
        minWithdraw: 200,
        refRates: { l1: 0.1, l2: 0.05, l3: 0.02 },
        country: "PK",
      },
    },
    create: {
      key: "platform",
      value: {
        welcomeBonus: 10,
        dailyQuizReward: 30,
        minWithdraw: 200,
        refRates: { l1: 0.1, l2: 0.05, l3: 0.02 },
        country: "PK",
      },
    },
  });

  // --- Super admin ---
  const adminPassword = await argon2.hash("admin12345");
  const admin = await prisma.user.upsert({
    where: { email: "admin@adverse.live" },
    update: {},
    create: {
      email: "admin@adverse.live",
      fullName: "Super Admin",
      displayName: "Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      referralCode: "ADMIN001",
      city: "Islamabad",
      country: "PK",
      wallet: { create: {} },
    },
  });
  console.log("✔ Admin:", admin.email);

  // --- Daily quiz question bank (Roman Urdu, easy level) ---
  const quizBank: {
    id: string;
    category: QuizCategory;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[] = [
    { id: "q-isl-1", category: "ISLAMIC", question: "Islam mein kitne arkan (pillars) hain?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "Islam ke 5 arkan: Shahada, Namaz, Roza, Zakat, Hajj." },
    { id: "q-isl-2", category: "ISLAMIC", question: "Quran-e-Pak ki pehli surah ka naam kya hai?", options: ["Surah Baqarah", "Surah Fatiha", "Surah Ikhlas", "Surah Yaseen"], correctIndex: 1 },
    { id: "q-isl-3", category: "ISLAMIC", question: "Roza kis Islamic mahine mein farz hai?", options: ["Shawwal", "Ramadan", "Muharram", "Rajab"], correctIndex: 1 },
    { id: "q-pk-1", category: "PAKISTAN", question: "Pakistan ka qaumi tarana kis ne likha?", options: ["Allama Iqbal", "Faiz Ahmed Faiz", "Hafeez Jalandhari", "Josh Malihabadi"], correctIndex: 2 },
    { id: "q-pk-2", category: "PAKISTAN", question: "Pakistan ka darul-hukoomat (capital) konsa sheher hai?", options: ["Karachi", "Lahore", "Islamabad", "Peshawar"], correctIndex: 2 },
    { id: "q-pk-3", category: "PAKISTAN", question: "Pakistan kab azaad hua?", options: ["14 August 1947", "23 March 1940", "15 August 1947", "9 November 1947"], correctIndex: 0 },
    { id: "q-gen-1", category: "GENERAL", question: "Aik hafte mein kitne din hote hain?", options: ["5", "6", "7", "8"], correctIndex: 2 },
    { id: "q-gen-2", category: "GENERAL", question: "Paani ka chemical formula kya hai?", options: ["CO2", "H2O", "O2", "NaCl"], correctIndex: 1 },
    { id: "q-adb-1", category: "ADAB", question: "Bare kisi se milne par sabse pehle kya kehna chahiye?", options: ["Hi", "As-salamu alaykum", "Hello", "Bye"], correctIndex: 1 },
    { id: "q-adb-2", category: "ADAB", question: "Khaana shuru karne se pehle kya parhna chahiye?", options: ["Bismillah", "Alhamdulillah", "Subhan Allah", "Allahu Akbar"], correctIndex: 0 },
  ];
  for (const q of quizBank) {
    await prisma.quizQuestion.upsert({ where: { id: q.id }, update: {}, create: q });
  }
  console.log(`✔ Quiz bank seeded: ${quizBank.length} questions`);

  // --- Missions (no ads — quiz, friends, voice rooms) ---
  const missions = [
    { code: "DAILY_QUIZ", title: "Aaj ka quiz solve karein", type: "DAILY" as const, goal: 1, rewardCash: 30, rewardXp: 20 },
    { code: "DAILY_INVITE_1", title: "Aik dost invite karein", type: "DAILY" as const, goal: 1, rewardCash: 25, rewardXp: 50 },
    { code: "DAILY_VOICE_1", title: "Aik voice room mein 10 min", type: "DAILY" as const, goal: 1, rewardCash: 0, rewardXp: 30 },
    { code: "DAILY_CHAT_3", title: "3 dosto ko message karein", type: "DAILY" as const, goal: 3, rewardCash: 0, rewardXp: 15 },
    { code: "WEEKLY_STREAK_7", title: "7-din ka streak", type: "WEEKLY" as const, goal: 7, rewardCash: 200, rewardXp: 400 },
    { code: "WEEKLY_HOST_2", title: "Apne 2 voice rooms host karein", type: "WEEKLY" as const, goal: 2, rewardCash: 150, rewardXp: 300 },
    { code: "WEEKLY_REFER_5", title: "5 dosto ko team mein lekar aaiye", type: "WEEKLY" as const, goal: 5, rewardCash: 250, rewardXp: 500 },
  ];
  for (const m of missions) {
    await prisma.mission.upsert({ where: { code: m.code }, update: {}, create: m });
  }

  // --- Achievements ---
  const ach = [
    { code: "FIRST_QUIZ", title: "Pehla Quiz", description: "Pehla quiz solve kiya", rarity: "common", rewardXp: 50 },
    { code: "QUIZ_PRO", title: "Quiz Pro", description: "10 sahi jawab diye", rarity: "rare", rewardXp: 200 },
    { code: "RECRUITER", title: "Recruiter", description: "10 dost invite kiye", rarity: "rare", rewardXp: 200 },
    { code: "VOICE_STAR", title: "Voice Star", description: "5 voice rooms host kiye", rarity: "rare", rewardXp: 200 },
    { code: "STREAK_MASTER", title: "Streak Master", description: "12-din ka streak", rarity: "epic", rewardXp: 400 },
    { code: "FRIEND_CIRCLE", title: "Dost Circle", description: "20 friends bana liye", rarity: "epic", rewardXp: 400 },
  ];
  for (const a of ach) {
    await prisma.achievement.upsert({ where: { code: a.code }, update: {}, create: a });
  }

  console.log("✔ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
