export type AccountType = 'buyer' | 'business';
export type VerificationStatus = 'verified' | 'pending';

export interface BusinessProfileData {
  name: string;
  description: string;
  location: string;
  businessType: string;
  registrationNumber?: string;
  verificationDocumentUri?: string;
  verificationStatus: VerificationStatus;
}

export interface AccountProfile {
  accountType: AccountType;
  fullName: string;
  location: string;
  sourcingCategory?: string;
  business?: BusinessProfileData;
}

export type SupplierId = 'greenfield' | 'primeharvest' | 'buildright';

export interface SupplierProfile {
  id: SupplierId;
  name: string;
  description: string;
  location: string;
  businessType: string;
  rating: string;
  reviews: string;
  years: string;
  responseRate: string;
  established: string;
  paymentTerms: string;
  deliveryArea: string;
  categories: string[];
  verified: boolean;
}

export const ACCOUNT_PROFILE_STORAGE_KEY = 'duzo.account.profile';

export const DEFAULT_BUSINESS_PROFILE: BusinessProfileData = {
  name: 'GreenField Agro Supplies',
  description:
    'Quality agricultural products for a better tomorrow. We supply grains, seeds, fertilizers and farm inputs across Nigeria.',
  location: 'Kaduna, Nigeria',
  businessType: 'Supplier & Distributor',
  verificationStatus: 'verified',
};

export const SUPPLIER_PROFILES: Record<SupplierId, SupplierProfile> = {
  greenfield: {
    id: 'greenfield',
    name: 'GreenField Agro Supplies',
    description:
      'GreenField Agro Supplies is a trusted supplier of high-quality grains, seeds, fertilizers and farm inputs. We work with local farmers and distributors across Nigeria.',
    location: 'Kaduna, Nigeria',
    businessType: 'Supplier & Distributor',
    rating: '4.8',
    reviews: '124 reviews',
    years: '3+ years',
    responseRate: '98%',
    established: '2021',
    paymentTerms: 'Net 15 / 30',
    deliveryArea: 'Nationwide',
    categories: ['Maize', 'Soya Beans', 'Fertilizers', 'Agro Inputs'],
    verified: true,
  },
  primeharvest: {
    id: 'primeharvest',
    name: 'PrimeHarvest Foods',
    description:
      'PrimeHarvest Foods sources and processes quality food ingredients for wholesalers, retailers and manufacturers.',
    location: 'Lagos, Nigeria',
    businessType: 'Food Processor & Wholesaler',
    rating: '4.6',
    reviews: '88 reviews',
    years: '2+ years',
    responseRate: '94%',
    established: '2022',
    paymentTerms: 'Net 7 / 14',
    deliveryArea: 'Nationwide',
    categories: ['Soybeans', 'Grains', 'Food & FMCG', 'Packaging'],
    verified: true,
  },
  buildright: {
    id: 'buildright',
    name: 'BuildRight Materials',
    description:
      'A verified source for dependable construction materials, building supplies and bulk project orders.',
    location: 'Abuja, Nigeria',
    businessType: 'Building Materials Supplier',
    rating: '4.5',
    reviews: '61 reviews',
    years: '4+ years',
    responseRate: '91%',
    established: '2020',
    paymentTerms: 'Net 15',
    deliveryArea: 'North-Central Nigeria',
    categories: ['Cement', 'Steel', 'Roofing', 'Building Supplies'],
    verified: true,
  },
};
