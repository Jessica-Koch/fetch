// packages/shared/src/dog.ts
export const DogStatus = {
  AVAILABLE :'AVAILABLE',
  PENDING :'PENDING',
  ADOPTED :'ADOPTED',
  HOLD :'HOLD',
  MEDICAL :'MEDICAL'
} as const;

export const Placement = {
  IN_FOSTER: 'IN_FOSTER',
  BOARDING: 'BOARDING',
  FOSTER_TO_ADOPT: 'FOSTER_TO_ADOPT'
} as const;

export const Gender= {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN'
} as const ; 

export const Size = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE'
} as const;

export const Coat = {
  HAIRLESS: 'HAIRLESS',
  SHORT: 'SHORT',
  MEDIUM: 'MEDIUM',
  LONG: 'LONG',
  WIRE: 'WIRE',
  CURLY: 'CURLY'
} as const

// Type exports for frontend
export type GenderType = keyof typeof Gender;
export type SizeType = keyof typeof Size;
export type CoatType = keyof typeof Coat;
export type DogStatusType = keyof typeof DogStatus;
export type PlacementType = keyof typeof Placement;

export interface Dog {
  id: string;
  name: string;
  
  // Basic info
  breed: string;
  breedSecondary: string | null;
  breedMixed: boolean;
  breedUnknown: boolean;
  
  age: number;
  weight: number | null;
  description: string | null;
  
  // Physical characteristics
  gender: keyof typeof Gender;
  size: keyof typeof Size;
  coat: keyof typeof Coat | null;
  colorPrimary: string | null;
  colorSecondary: string | null;
  colorTertiary: string | null;
  
  // Status and placement
  status: keyof typeof DogStatus;
  placement: keyof typeof Placement;
  
  // Health and training attributes
  spayedNeutered: boolean;
  houseTrained: boolean;
  declawed: boolean | null;
  specialNeeds: boolean;
  shotsCurrent: boolean;
  
  // Environment compatibility
  goodWithChildren: boolean | null;
  goodWithDogs: boolean | null;
  goodWithCats: boolean | null;
  
  // Media and tags
  photos: string[];
  videos: string[];
  tags: string[];
  
  // Petfinder integration
  petfinderId: string | null;
  postedToPetfinder: boolean;
  
  // Contact info
  contactEmail: string | null;
  contactPhone: string | null;
  
  // Petfinder sync tracking
  petfinderSyncStatus: string;
  petfinderLastSync: Date | null;
  petfinderErrors: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDogRequest {
  name: string;
  breed: string;
  breedSecondary?: string;
  breedMixed?: boolean;
  breedUnknown?: boolean;
  age: number;
  weight?: number;
  description?: string;
  gender: keyof typeof Gender;
  size: keyof typeof Size;
  coat?: keyof typeof Coat;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  spayedNeutered?: boolean;
  houseTrained?: boolean;
  specialNeeds?: boolean;
  shotsCurrent?: boolean;
  goodWithChildren?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  photos?: string[];
  videos?: string[];
  tags?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateDogRequest {
  name?: string;
  breed?: string;
  breedSecondary?: string;
  breedMixed?: boolean;
  breedUnknown?: boolean;
  age?: number;
  weight?: number;
  description?: string;
  gender?: keyof typeof Gender;
  size?: keyof typeof Size;
  coat?: keyof typeof Coat;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  status?: keyof typeof DogStatus;
  placement?: keyof typeof Placement;
  spayedNeutered?: boolean;
  houseTrained?: boolean;
  specialNeeds?: boolean;
  shotsCurrent?: boolean;
  goodWithChildren?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  photos?: string[];
  videos?: string[];
  tags?: string[];
  contactEmail?: string;
  contactPhone?: string;
}