export interface Listing {
  id: string;
  apartmentBuilding: string;
  isShared: boolean;
  location: string;
  squareFeet: number;
  leaseType: 'long-term' | 'short-term' | 'both';
  rent: number;
  isNegotiable: boolean;
  priceMode: 'per-month' | 'utilities-included';
  isFurnished: boolean;
  amenities: string[];
  description: string;
  images: string[];
  createdAt: string; // UTC format: YYYY-MM-DD HH:MM:SS
  userId: string;
  contactDetails: ContactDetails;
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}
