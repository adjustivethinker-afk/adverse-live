export const PK_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Sheikhupura",
  "Mardan",
  "Mirpur",
  "Mingora",
  "Jhang",
  "Dera Ghazi Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantt",
  "Kasur",
  "Gujrat",
  "Chiniot",
  "Kamoke",
  "Nawabshah",
  "Mandi Bahauddin",
  "Tando Adam",
  "Khanewal",
  "Dadu",
  "Vehari",
  "Jhelum",
  "Khairpur",
  "Tando Allahyar",
  "Burewala",
  "Daska",
  "Chichawatni",
  "Hafizabad",
  "Bhakkar",
  "Khuzdar",
  "Abbottabad",
  "Other",
] as const;

export type PkCity = (typeof PK_CITIES)[number];

/** Loose Pakistan phone validator — accepts +92, 0092, or local 03xx formats. */
export function isValidPkPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  // +92 3xx xxxxxxx => 12 digits starting with 92, or 11 digits starting with 0
  if (digits.startsWith("92") && digits.length === 12 && digits[2] === "3") return true;
  if (digits.startsWith("0") && digits.length === 11 && digits[1] === "3") return true;
  return false;
}

/** Normalize to +92 3xx xxxxxxx form. */
export function formatPkPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  let local = "";
  if (digits.startsWith("92")) local = digits.slice(2);
  else if (digits.startsWith("0")) local = digits.slice(1);
  else local = digits;
  if (local.length < 10) return input;
  return `+92 ${local.slice(0, 3)} ${local.slice(3, 10)}`;
}
