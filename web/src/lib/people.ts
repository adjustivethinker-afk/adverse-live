/**
 * Demo Pakistani users for friends list, chats and voice rooms.
 * In production these come from the backend.
 */

export type Person = {
  id: string;
  fullName: string;
  username: string;
  city: string;
  gender: "male" | "female";
  level: number;
  bio?: string;
  online: boolean;
  lastSeenMin: number; // minutes ago
  activityScore: number; // 0..100, used to sort friends
};

const PERSONS: Person[] = [
  { id: "p1", fullName: "Aroush Khan", username: "aroush", city: "Karachi", gender: "female", level: 12, bio: "Karachi se 🌃 | Ahli kalam ki shauqeen", online: true, lastSeenMin: 0, activityScore: 96 },
  { id: "p2", fullName: "Hassan Raza", username: "hassan_r", city: "Lahore", gender: "male", level: 10, bio: "Music aur dosti", online: true, lastSeenMin: 0, activityScore: 94 },
  { id: "p3", fullName: "Sara Malik", username: "sara_m", city: "Islamabad", gender: "female", level: 14, bio: "Wellness coach", online: true, lastSeenMin: 0, activityScore: 92 },
  { id: "p4", fullName: "Bilal Rauf", username: "bilalr", city: "Faisalabad", gender: "male", level: 9, bio: "Late night coder ✦", online: true, lastSeenMin: 0, activityScore: 90 },
  { id: "p5", fullName: "Zoya Mir", username: "zoya", city: "Multan", gender: "female", level: 11, bio: "Karachi se aaj Multan", online: false, lastSeenMin: 8, activityScore: 88 },
  { id: "p6", fullName: "Imran Ahmad", username: "imrana", city: "Karachi", gender: "male", level: 13, bio: "Cricket fan 🏏", online: true, lastSeenMin: 0, activityScore: 87 },
  { id: "p7", fullName: "Maya Shahzad", username: "maya_s", city: "Lahore", gender: "female", level: 8, bio: "Urdu shayari ✿", online: false, lastSeenMin: 22, activityScore: 84 },
  { id: "p8", fullName: "Zain Tariq", username: "zain", city: "Islamabad", gender: "male", level: 10, bio: "Gamer · Football fan", online: true, lastSeenMin: 0, activityScore: 80 },
  { id: "p9", fullName: "Reema Aslam", username: "reema", city: "Rawalpindi", gender: "female", level: 7, bio: "Designer 🎨", online: false, lastSeenMin: 45, activityScore: 76 },
  { id: "p10", fullName: "Faraz Iqbal", username: "faraz", city: "Karachi", gender: "male", level: 6, online: false, lastSeenMin: 100, activityScore: 70 },
  { id: "p11", fullName: "Hira Sheikh", username: "hira", city: "Sialkot", gender: "female", level: 8, online: true, lastSeenMin: 0, activityScore: 68 },
  { id: "p12", fullName: "Ahmed Khan", username: "ahmed_k", city: "Peshawar", gender: "male", level: 7, online: false, lastSeenMin: 130, activityScore: 64 },
  { id: "p13", fullName: "Mehak Akram", username: "mehak", city: "Karachi", gender: "female", level: 5, online: true, lastSeenMin: 0, activityScore: 60 },
  { id: "p14", fullName: "Daniyal Hussain", username: "daniyal", city: "Quetta", gender: "male", level: 6, online: false, lastSeenMin: 200, activityScore: 56 },
  { id: "p15", fullName: "Saad Mahmood", username: "saadm", city: "Hyderabad", gender: "male", level: 4, online: false, lastSeenMin: 60, activityScore: 50 },
  { id: "p16", fullName: "Nida Anwar", username: "nida", city: "Lahore", gender: "female", level: 6, online: false, lastSeenMin: 30, activityScore: 48 },
  { id: "p17", fullName: "Ayesha Tariq", username: "ayesha", city: "Karachi", gender: "female", level: 5, online: true, lastSeenMin: 0, activityScore: 44 },
  { id: "p18", fullName: "Kashaf Bibi", username: "kashaf", city: "Islamabad", gender: "female", level: 4, online: false, lastSeenMin: 600, activityScore: 38 },
  { id: "p19", fullName: "Ali Hamza", username: "alih", city: "Lahore", gender: "male", level: 3, online: false, lastSeenMin: 800, activityScore: 32 },
  { id: "p20", fullName: "Bushra Khan", username: "bushra", city: "Karachi", gender: "female", level: 2, online: false, lastSeenMin: 1200, activityScore: 25 },
];

/** Returns users sorted by activity score (most active first). */
export function getActiveUsers(): Person[] {
  return [...PERSONS].sort((a, b) => b.activityScore - a.activityScore);
}

export function findPerson(id: string): Person | undefined {
  return PERSONS.find((p) => p.id === id);
}

export function lastSeenLabel(p: Person) {
  if (p.online) return "Online";
  if (p.lastSeenMin < 60) return `Last seen ${p.lastSeenMin} min ago`;
  if (p.lastSeenMin < 60 * 24) return `Last seen ${Math.floor(p.lastSeenMin / 60)}h ago`;
  return `Last seen ${Math.floor(p.lastSeenMin / (60 * 24))}d ago`;
}
