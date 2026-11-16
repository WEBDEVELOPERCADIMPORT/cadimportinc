import type { VCardData } from "../../types/vcard";

/**
 * Escapes special characters in vCard 3.0 property values.
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

/**
 * Builds a vCard 3.0 string from a structured VCardData object.
 * Includes: First Name, Last Name, Company, Title, Phone, Other Phone,
 * Email, Primary Address, and Website.
 */
export function buildVCardString(vcard: VCardData): string {
  const firstName = escapeVCardValue(vcard.firstName);
  const lastName = escapeVCardValue(vcard.lastName);
  const fullName = escapeVCardValue(`${vcard.firstName} ${vcard.lastName}`.trim());
  const company = escapeVCardValue(vcard.company);
  const title = escapeVCardValue(vcard.title);

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${fullName}`,
    `ORG:${company}`,
    `TITLE:${title}`,
    `TEL;TYPE=CELL,VOICE:${vcard.phone}`,
    `TEL;TYPE=WORK,VOICE:${vcard.otherPhone}`,
    `EMAIL;TYPE=PREF,INTERNET:${vcard.email}`,
    `ADR;TYPE=WORK,PREF:;;${escapeVCardValue(vcard.address.street)};${escapeVCardValue(vcard.address.city)};${escapeVCardValue(vcard.address.state)};${escapeVCardValue(vcard.address.postalCode)};${escapeVCardValue(vcard.address.country)}`,
    `URL:${vcard.website}`,
    "END:VCARD",
  ];

  return lines.join("\r\n");
}
