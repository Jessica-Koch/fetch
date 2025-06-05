// packages/shared/src/petfinder.ts
import type { CreateDogRequest } from './dog';

export interface PetfinderAuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

export interface PetfinderAnimal {
  id: number;
  organization_id: string;
  url: string;
  type: string;
  species: string;
  breeds: {
    primary: string;
    secondary?: string;
    mixed: boolean;
    unknown: boolean;
  };
  colors: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  age: string;
  gender: string;
  size: string;
  coat?: string;
  name: string;
  description?: string;
  photos: Array<{
    small: string;
    medium: string;
    large: string;
    full: string;
  }>;
  videos: Array<{
    embed: string;
  }>;
  status: string;
  attributes: {
    spayed_neutered: boolean;
    house_trained: boolean;
    declawed?: boolean;
    special_needs: boolean;
    shots_current: boolean;
  };
  environment: {
    children?: boolean;
    dogs?: boolean;
    cats?: boolean;
  };
  tags: string[];
  contact: {
    email?: string;
    phone?: string;
    address: {
      address1?: string;
      address2?: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  published_at?: string;
  distance?: number;
  _links: {
    self: { href: string };
    type: { href: string };
    organization: { href: string };
  };
}

export interface PetfinderOrganization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  url: string;
  website?: string;
  mission_statement?: string;
  adoption: {
    policy?: string;
    url?: string;
  };
  social_media: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    pinterest?: string;
  };
  photos: Array<{
    small: string;
    medium: string;
    large: string;
    full: string;
  }>;
  distance?: number;
  _links: {
    self: { href: string };
    animals: { href: string };
  };
}

export interface PetfinderApiResponse<T> {
  data?: T;
  pagination?: {
    count_per_page: number;
    total_count: number;
    current_page: number;
    total_pages: number;
    _links: {
      previous?: { href: string };
      next?: { href: string };
    };
  };
}

export interface PetfinderType {
  name: string;
  coats: string[];
  colors: string[];
  genders: string[];
  _links: {
    self: { href: string };
    breeds: { href: string };
  };
}

export interface PetfinderBreed {
  name: string;
  _links: {
    type: { href: string };
  };
}

// Integration types for our system
export interface CreateDogWithPetfinderRequest extends CreateDogRequest {
  autoUploadToPetfinder?: boolean;
  petfinderMethod?: 'ftp' | 'scraper' | 'auto';
  useFallback?: boolean;
}