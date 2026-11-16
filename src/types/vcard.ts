export interface VCardAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
}

export interface VCardCompany {
  name: string;
  address: VCardAddress;
  secondaryAddress?: string;
  countryLabel?: string;
  website: string;
  websiteUrl: string;
  phone: string;
}

export interface VCardSocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
}

/**
 * Standard vCard contact payload used for QR code generation and .vcf export.
 */
export interface VCardData {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
  otherPhone: string;
  email: string;
  address: VCardAddress;
  website: string;
}

export interface EmployeeBusinessCard {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  avatar: string;
  phone: string;
  otherPhone: string;
  email: string;
  social: VCardSocialLinks;
  company: VCardCompany;
  vcard: VCardData;
}
