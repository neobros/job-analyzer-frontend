// Keep the `id` list in sync with backend/src/constants/verticals.js (VERTICAL_SLUGS).
import {
  Building2,
  Car,
  FileCheck,
  GraduationCap,
  Home,
  HeartPulse,
  Landmark,
  Newspaper,
  Plane,
  Scale,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  Zap
} from 'lucide-react';

export const VERTICALS = [
  { id: 'accommodation', icon: Home, name: 'Accommodation', tagline: 'Find verified rooms, shared housing, and short-stay rentals from hosts who understand the new-arrival journey.' },
  { id: 'education', icon: GraduationCap, name: 'Education', tagline: 'Connect with language schools, tutors, and credential-recognition services to keep your learning and career plans on track.' },
  { id: 'migration', icon: FileCheck, name: 'Migration', tagline: 'Work with vetted visa, immigration, and settlement consultants for every step of the relocation process.' },
  { id: 'real-estate', icon: Building2, name: 'Real Estate', tagline: 'Browse verified property listings and connect with agents for renting or buying a long-term home.' },
  { id: 'cars-transport', icon: Car, name: 'Cars & Transport', tagline: 'Buy, sell, or rent vehicles and compare local transport options from trusted sellers and providers.' },
  { id: 'banking-finance', icon: Landmark, name: 'Banking & Finance', tagline: 'Get matched with banks, money-transfer services, and financial advisors experienced in supporting newcomers.' },
  { id: 'insurance', icon: ShieldCheck, name: 'Insurance', tagline: 'Compare health, travel, auto, and life insurance options built around new-resident needs.' },
  { id: 'utilities', icon: Zap, name: 'Utilities', tagline: 'Set up electricity, water, internet, and mobile plans quickly with providers who serve new arrivals.' },
  { id: 'healthcare', icon: HeartPulse, name: 'Healthcare', tagline: 'Find doctors, clinics, and health services, including providers who support multiple languages.' },
  { id: 'family-community', icon: Users, name: 'Family & Community', tagline: 'Discover childcare, schools, cultural associations, and community groups to help you build a support network.' },
  { id: 'legal-tax', icon: Scale, name: 'Legal & Tax', tagline: 'Access lawyers, tax advisors, and notary services for contracts, filings, and legal peace of mind.' },
  { id: 'marketplace', icon: ShoppingBag, name: 'Marketplace', tagline: 'Buy and sell furniture, electronics, and everyday essentials directly with people in your new city.' },
  { id: 'food-lifestyle', icon: UtensilsCrossed, name: 'Food & Lifestyle', tagline: 'Explore restaurants, grocery stores, and lifestyle services that bring familiar comforts to a new home.' },
  { id: 'travel', icon: Plane, name: 'Travel', tagline: 'Plan flights, local tours, and getaways with travel providers experienced in relocation logistics.' },
  { id: 'media', icon: Newspaper, name: 'Media', tagline: 'Stay informed with local news, classifieds, and community content made for the new-arrival audience.' }
];

export function findVertical(id) {
  return VERTICALS.find((vertical) => vertical.id === id);
}

// Optional extra fields shown on the create-listing form for a given vertical,
// stored in Listing.details (schema-less on the backend, so more fields can
// be added here later with zero migration).
export const VERTICAL_DETAIL_FIELDS = {
  accommodation: [
    { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
    { key: 'furnished', label: 'Furnished', type: 'checkbox' }
  ],
  education: [
    { key: 'studyLevel', label: 'Study level', type: 'text' }
  ],
  migration: [],
  'real-estate': [
    { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
    { key: 'listingType', label: 'For sale / for rent', type: 'text' }
  ],
  'cars-transport': [
    { key: 'make', label: 'Make', type: 'text' },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'mileage', label: 'Mileage', type: 'number' }
  ],
  'banking-finance': [],
  insurance: [
    { key: 'insuranceType', label: 'Insurance type', type: 'text' }
  ],
  utilities: [
    { key: 'serviceType', label: 'Service type', type: 'text' }
  ],
  healthcare: [
    { key: 'specialty', label: 'Specialty', type: 'text' }
  ],
  'family-community': [],
  'legal-tax': [
    { key: 'serviceType', label: 'Service type', type: 'text' }
  ],
  marketplace: [
    { key: 'condition', label: 'Condition', type: 'text' }
  ],
  'food-lifestyle': [
    { key: 'cuisineType', label: 'Cuisine type', type: 'text' }
  ],
  travel: [
    { key: 'destination', label: 'Destination', type: 'text' }
  ],
  media: [
    { key: 'mediaType', label: 'Media type', type: 'text' }
  ]
};
