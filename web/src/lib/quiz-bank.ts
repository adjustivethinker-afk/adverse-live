/**
 * Daily quiz question bank.
 * Categories: Islamic · Pakistan · General Knowledge · Current Affairs · Adab.
 * Sab questions Roman Urdu mein, easy level — har Pakistani user samajh sake.
 */

export type QuizCategory = "Islamic" | "Pakistan" | "General" | "Current" | "Adab";

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  q: string;
  options: string[];
  correctIndex: number;
  explain?: string;
};

export const QUIZ_BANK: QuizQuestion[] = [
  // -------- Islamic (easy) --------
  { id: "i1", category: "Islamic", q: "Islam mein kitne arkan (pillars) hain?", options: ["3", "4", "5", "6"], correctIndex: 2, explain: "Islam ke 5 arkan hain: Shahada, Namaz, Roza, Zakat, Hajj." },
  { id: "i2", category: "Islamic", q: "Quran-e-Pak ki pehli surah ka naam kya hai?", options: ["Surah Baqarah", "Surah Fatiha", "Surah Ikhlas", "Surah Yaseen"], correctIndex: 1 },
  { id: "i3", category: "Islamic", q: "Hazrat Muhammad ﷺ ka mubarak janam kis sheher mein hua?", options: ["Madina", "Makkah", "Taif", "Yathrib"], correctIndex: 1 },
  { id: "i4", category: "Islamic", q: "Roza kis Islamic mahine mein farz hai?", options: ["Shawwal", "Ramadan", "Muharram", "Rajab"], correctIndex: 1 },
  { id: "i5", category: "Islamic", q: "Farz namazon ki tadaad ek din mein kitni hai?", options: ["3", "4", "5", "6"], correctIndex: 2 },
  { id: "i6", category: "Islamic", q: "Zakat kitne hisson mein di jaati hai (muqarrar fee sad)?", options: ["1.5%", "2.5%", "5%", "10%"], correctIndex: 1, explain: "Saal ke baad nisaab par 2.5% zakat hoti hai." },
  { id: "i7", category: "Islamic", q: "Hajj kis sheher mein kiya jaata hai?", options: ["Madina", "Karbala", "Makkah", "Quds"], correctIndex: 2 },
  { id: "i8", category: "Islamic", q: "Quran-e-Pak mein kitni Surah hain?", options: ["104", "114", "120", "99"], correctIndex: 1 },

  // -------- Pakistan --------
  { id: "p1", category: "Pakistan", q: "Pakistan ka qaumi tarana kis ne likha?", options: ["Allama Iqbal", "Faiz Ahmed Faiz", "Hafeez Jalandhari", "Josh Malihabadi"], correctIndex: 2 },
  { id: "p2", category: "Pakistan", q: "Pakistan ka darul-hukoomat (capital) konsa sheher hai?", options: ["Karachi", "Lahore", "Islamabad", "Peshawar"], correctIndex: 2 },
  { id: "p3", category: "Pakistan", q: "Pakistan kab azaad hua?", options: ["14 August 1947", "23 March 1940", "15 August 1947", "9 November 1947"], correctIndex: 0 },
  { id: "p4", category: "Pakistan", q: "Pakistan ke baani (founder) kaun hain?", options: ["Allama Iqbal", "Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Sir Syed Ahmed Khan"], correctIndex: 2 },
  { id: "p5", category: "Pakistan", q: "Pakistan ka qaumi phool kya hai?", options: ["Gulab", "Chambeli", "Sunflower", "Marigold"], correctIndex: 1 },
  { id: "p6", category: "Pakistan", q: "Pakistan ka qaumi parinda (bird) konsa hai?", options: ["Mor", "Chakor", "Cheel", "Bulbul"], correctIndex: 1 },
  { id: "p7", category: "Pakistan", q: "Pakistan ka sabse bara sheher konsa hai?", options: ["Lahore", "Islamabad", "Karachi", "Faisalabad"], correctIndex: 2 },
  { id: "p8", category: "Pakistan", q: "Pakistan ki currency ka naam kya hai?", options: ["Rupee", "Taka", "Dinar", "Riyal"], correctIndex: 0 },
  { id: "p9", category: "Pakistan", q: "Yaum-e-Pakistan kis tareekh ko manaya jaata hai?", options: ["14 August", "23 March", "6 September", "25 December"], correctIndex: 1, explain: "23 March ko Qarardad-e-Pakistan ki yaad mein manaya jaata hai." },
  { id: "p10", category: "Pakistan", q: "Pakistan ka qaumi khel konsa hai?", options: ["Cricket", "Hockey", "Football", "Kabaddi"], correctIndex: 1 },
  { id: "p11", category: "Pakistan", q: "Pakistan ka sabse oonchi choti (peak) ka naam?", options: ["K2", "Nanga Parbat", "Tirich Mir", "Rakaposhi"], correctIndex: 0 },
  { id: "p12", category: "Pakistan", q: "Pakistan ki qaumi zubaan kya hai?", options: ["Punjabi", "Urdu", "Sindhi", "Pashto"], correctIndex: 1 },

  // -------- General knowledge --------
  { id: "g1", category: "General", q: "Suraj ka rang asal mein kya hota hai?", options: ["Peela", "Safed", "Laal", "Neela"], correctIndex: 1, explain: "Asal mein suraj safed roshni deta hai. Atmosphere ki wajah se peela dikhta hai." },
  { id: "g2", category: "General", q: "Aik hafte mein kitne din hote hain?", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { id: "g3", category: "General", q: "Saal ka sabse chhota mahina konsa hai?", options: ["January", "February", "April", "December"], correctIndex: 1 },
  { id: "g4", category: "General", q: "Insan ke jism mein kitne dil hote hain?", options: ["1", "2", "3", "4"], correctIndex: 0 },
  { id: "g5", category: "General", q: "Paani ka chemical formula kya hai?", options: ["CO2", "H2O", "O2", "NaCl"], correctIndex: 1 },
  { id: "g6", category: "General", q: "Duniya ka sabse bara samandar konsa hai?", options: ["Atlantic", "Hindustani", "Pacific", "Arctic"], correctIndex: 2 },
  { id: "g7", category: "General", q: "Aik dozen mein kitni cheezein hoti hain?", options: ["10", "12", "20", "24"], correctIndex: 1 },
  { id: "g8", category: "General", q: "Sabz rang kin do rangon ko mila kar banta hai?", options: ["Laal + Peela", "Neela + Peela", "Neela + Laal", "Safed + Kala"], correctIndex: 1 },
  { id: "g9", category: "General", q: "Aik saal mein kitne mahine hote hain?", options: ["10", "11", "12", "13"], correctIndex: 2 },
  { id: "g10", category: "General", q: "Insan kis cheez se saans leta hai?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctIndex: 1 },

  // -------- Current affairs (basic & evergreen) --------
  { id: "c1", category: "Current", q: "Pakistan ki qaumi assembly ka sadar kis ko kehte hain?", options: ["Sadr", "Speaker", "Wazeer-e-Azam", "Chief Justice"], correctIndex: 1 },
  { id: "c2", category: "Current", q: "Pakistan kis benchmark ko apne dollar reserves ke liye use karta hai?", options: ["State Bank", "HBL", "MCB", "NBP"], correctIndex: 0 },
  { id: "c3", category: "Current", q: "JazzCash aur EasyPaisa kis qism ki services hain?", options: ["Mobile wallet", "Bank loan", "Airline", "Hospital"], correctIndex: 0 },
  { id: "c4", category: "Current", q: "Pakistan ka qaumi din (Independence Day) kis tareekh ko hai?", options: ["1 January", "14 August", "23 March", "9 November"], correctIndex: 1 },
  { id: "c5", category: "Current", q: "Cricket ka world cup pehli baar Pakistan ne kab jeeta?", options: ["1987", "1992", "1996", "1999"], correctIndex: 1 },

  // -------- Adab / Akhlaq --------
  { id: "a1", category: "Adab", q: "Bare kisi ko pehli baar milne par sabse pehle kya kehna chahiye?", options: ["Hi", "Salam (As-salamu alaykum)", "Hello", "Bye"], correctIndex: 1 },
  { id: "a2", category: "Adab", q: "Khaana shuru karne se pehle kya parhna chahiye?", options: ["Bismillah", "Alhamdulillah", "Subhan Allah", "Allahu Akbar"], correctIndex: 0 },
  { id: "a3", category: "Adab", q: "Khaana khatam karne ke baad kya parhna behtareen hai?", options: ["Bismillah", "Alhamdulillah", "Astaghfirullah", "La ilaha illallah"], correctIndex: 1 },
  { id: "a4", category: "Adab", q: "Walidain ke saath kis tarah pesh aana chahiye?", options: ["Sakhti se", "Adab aur narmi se", "Be-rukhi se", "Mazaaq se"], correctIndex: 1 },
  { id: "a5", category: "Adab", q: "Kisi ki madad ke baad usse kya kehna sikhayata hai?", options: ["Sorry", "Shukriya", "Khuda Hafiz", "Mubarak"], correctIndex: 1 },
  { id: "a6", category: "Adab", q: "Padosi (neighbour) ke saath kya rawayya hona chahiye?", options: ["Lar-jhag", "Mehrbani aur khayal", "Bezari", "Jealousy"], correctIndex: 1 },
  { id: "a7", category: "Adab", q: "Jhoot bolna kya hai?", options: ["Acha kaam", "Buri aadat", "Mazaaq", "Zaroori"], correctIndex: 1 },
  { id: "a8", category: "Adab", q: "Waqt ki qadar ka matlab kya hai?", options: ["Time waste karna", "Time ka sahi istemal", "Sona", "Khelna"], correctIndex: 1 },
];

/**
 * Pick a deterministic question for a given user + day.
 * Same user gets same question for same day (so refresh cheating doesn't change it).
 */
export function pickDailyQuestion(userId: string, dayKey: string): QuizQuestion {
  const seed = hash(`${userId}::${dayKey}`);
  return QUIZ_BANK[seed % QUIZ_BANK.length];
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0);
}
