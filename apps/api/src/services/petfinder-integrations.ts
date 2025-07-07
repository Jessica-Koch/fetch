import type { Dog } from '@fetch/shared';

export type UploadMethod = 'manual';

interface PetfinderIntegrationConfig {
  scraper: {
    username: string;
    password: string;
  };
  organizationId: string;
}

export interface UploadResult {
  success: boolean;
  method: 'manual';
  petfinderId?: string;
  error?: string;
  message: string;
  manualUploadUrl?: string;
}

// Helper function to format dog data for manual entry or scraper
function formatDogForManualEntry(dog: Dog) {
  return {
    // Basic Information
    name: dog.name,
    type: 'Dog',
    breed_primary: dog.breed,
    breed_secondary: dog.breedSecondary || '',
    mixed_breed: dog.breedMixed,
    unknown_breed: dog.breedUnknown,

    // Physical Characteristics
    age: mapAgeToCategory(dog.age),
    gender: dog.gender,
    size: dog.size,
    coat: dog.coat || '',
    color_primary: dog.colorPrimary || '',
    color_secondary: dog.colorSecondary || '',
    color_tertiary: dog.colorTertiary || '',

    // Attributes
    spayed_neutered: dog.spayedNeutered,
    house_trained: dog.houseTrained,
    special_needs: dog.specialNeeds,
    shots_current: dog.shotsCurrent,

    // Environment
    good_with_children: dog.goodWithChildren,
    good_with_dogs: dog.goodWithDogs,
    good_with_cats: dog.goodWithCats,

    // Content
    description: dog.description || '',
    tags: dog.tags.join(', '),
    photos: dog.photos,
    videos: dog.videos,

    // Contact (if different from organization default)
    contact_email: dog.contactEmail || '',
    contact_phone: dog.contactPhone || '',

    // Status
    status: 'adoptable',
  };
}

// Mapping functions to match Petfinder expected values
function mapAgeToCategory(age: number): string {
  if (age < 1) return 'Baby';
  if (age < 3) return 'Young';
  if (age < 8) return 'Adult';
  return 'Senior';
}

function mapGender(gender: string): string {
  const genderMap: Record<string, string> = {
    MALE: 'Male',
    FEMALE: 'Female',
    UNKNOWN: 'Unknown',
  };
  return genderMap[gender] || 'Unknown';
}

function mapSize(size: string): string {
  const sizeMap: Record<string, string> = {
    SMALL: 'Small',
    MEDIUM: 'Medium',
    LARGE: 'Large',
    XLARGE: 'Extra Large',
  };
  return sizeMap[size] || 'Medium';
}

function mapCoat(coat?: string): string {
  if (!coat) return '';

  const coatMap: Record<string, string> = {
    HAIRLESS: 'Hairless',
    SHORT: 'Short',
    MEDIUM: 'Medium',
    LONG: 'Long',
    WIRE: 'Wire',
    CURLY: 'Curly',
  };
  return coatMap[coat] || '';
}
