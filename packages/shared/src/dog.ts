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

export interface Dog {
  id: string;
  name: string;
  
  // Basic info
  breed: string;
  breedSecondary?: string;
  breedMixed: boolean;
  breedUnknown: boolean;
  
  age: number;
  weight?: number;
  description?: string;
  
  // Physical characteristics
  gender: typeof Gender;
  size: typeof Size;
  coat?: typeof Coat;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  
  // Status and placement
  status: typeof DogStatus;
  placement: typeof Placement;
  
  // Health and training attributes
  spayedNeutered: boolean;
  houseTrained: boolean;
  declawed?: boolean;
  specialNeeds: boolean;
  shotsCurrent: boolean;
  
  // Environment compatibility
  goodWithChildren?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  
  // Media and tags
  photos: string[];
  videos: string[];
  tags: string[];
  
  // Petfinder integration
  petfinderId?: string;
  postedToPetfinder: boolean;
  
  // Contact info
  contactEmail?: string;
  contactPhone?: string;
  
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
  gender: typeof Gender;
  size: typeof Size;
  coat?: typeof Coat;
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
  gender?: typeof Gender;
  size?: typeof Size;
  coat?: typeof Coat;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  status?: typeof DogStatus;
  placement?: typeof Placement;
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