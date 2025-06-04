// apps/api/src/services/petfinder.ts
import type { Dog } from '@fetch/shared';

interface PetfinderCredentials {
  clientId: string;
  clientSecret: string;
}

interface PetfinderToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

interface PetfinderAnimal {
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
  age: string; // baby, young, adult, senior
  gender: string; // male, female, unknown
  size: string; // small, medium, large, xlarge
  coat?: string;
  name: string;
  description?: string;
  photos?: Array<{
    small: string;
    medium: string;
    large: string;
    full: string;
  }>;
  videos?: Array<{
    embed: string;
  }>;
  status: string; // adoptable, adopted, found
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
  tags?: string[];
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
  organization_id: string;
}

// Token storage (in production, use Redis or database)
let tokenCache: PetfinderToken | null = null;

const BASE_URL = 'https://api.petfinder.com/v2';

const isTokenValid = (token: PetfinderToken | null): token is PetfinderToken => {
  return token !== null && Date.now() < token.expires_at;
};

const authenticate = async (credentials: PetfinderCredentials): Promise<PetfinderToken> => {
  if (isTokenValid(tokenCache)) {
    return tokenCache;
  }

  const response = await fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Petfinder authentication failed: ${response.statusText}`);
  }

  const tokenData = await response.json();
  const newToken: PetfinderToken = {
    ...tokenData,
    expires_at: Date.now() + (tokenData.expires_in * 1000) - 60000, // 1 minute buffer
  };

  tokenCache = newToken;
  return newToken;
};

const makeRequest = async <T>(
  endpoint: string, 
  credentials: PetfinderCredentials,
  options: RequestInit = {}
): Promise<T> => {
  const token = await authenticate(credentials);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Petfinder API error: ${response.status} ${errorText}`);
  }

  return response.json();
};

// Convert our Dog model to Petfinder format
const dogToPetfinderFormat = (dog: Dog, organizationId: string): PetfinderAnimal => {
  // Convert age to Petfinder age categories
  const getPetfinderAge = (age: number): string => {
    if (age < 1) return 'baby';
    if (age < 3) return 'young';
    if (age < 8) return 'adult';
    return 'senior';
  };

  return {
    type: 'Dog',
    species: 'Dog',
    breeds: {
      primary: dog.breed,
      secondary: dog.breedSecondary || undefined,
      mixed: dog.breedMixed,
      unknown: dog.breedUnknown,
    },
    colors: {
      primary: dog.colorPrimary || undefined,
      secondary: dog.colorSecondary || undefined,
      tertiary: dog.colorTertiary || undefined,
    },
    age: getPetfinderAge(dog.age),
    gender: dog.gender.toLowerCase(),
    size: dog.size.toLowerCase(),
    coat: dog.coat?.toLowerCase(),
    name: dog.name,
    description: dog.description || undefined,
    photos: [], // TODO: Convert photo URLs to Petfinder format
    videos: [], // TODO: Convert video URLs to Petfinder format
    status: 'adoptable', // Map from our status enum
    attributes: {
      spayed_neutered: dog.spayedNeutered,
      house_trained: dog.houseTrained,
      declawed: dog.declawed,
      special_needs: dog.specialNeeds,
      shots_current: dog.shotsCurrent,
    },
    environment: {
      children: dog.goodWithChildren,
      dogs: dog.goodWithDogs,
      cats: dog.goodWithCats,
    },
    tags: dog.tags,
    contact: {
      email: dog.contactEmail,
      phone: dog.contactPhone,
      address: {
        city: 'Your City', // TODO: Get from organization settings
        state: 'Your State',
        postcode: 'Your Zip',
        country: 'US',
      },
    },
    organization_id: organizationId,
  };
};

// Create Petfinder API functions
export const createPetfinderAPI = (clientId: string, clientSecret: string) => {
  const credentials: PetfinderCredentials = { clientId, clientSecret };

  return {
    // Post a dog to Petfinder
    postAnimal: async (dog: Dog, organizationId: string): Promise<{ id: string }> => {
      const petfinderAnimal = dogToPetfinderFormat(dog, organizationId);
      
      const result = await makeRequest<{ animal: { id: string } }>('/animals', credentials, {
        method: 'POST',
        body: JSON.stringify(petfinderAnimal),
      });

      return { id: result.animal.id };
    },

    // Update a dog on Petfinder
    updateAnimal: async (petfinderId: string, dog: Dog, organizationId: string): Promise<void> => {
      const petfinderAnimal = dogToPetfinderFormat(dog, organizationId);
      
      await makeRequest(`/animals/${petfinderId}`, credentials, {
        method: 'PUT',
        body: JSON.stringify(petfinderAnimal),
      });
    },

    // Delete a dog from Petfinder
    deleteAnimal: async (petfinderId: string): Promise<void> => {
      await makeRequest(`/animals/${petfinderId}`, credentials, {
        method: 'DELETE',
      });
    },

    // Get organization info
    getOrganization: async (organizationId: string) => {
      return makeRequest(`/organizations/${organizationId}`, credentials);
    },

    // Search for animals
    searchAnimals: async (params: Record<string, string>) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/animals?${queryString}`, credentials);
    },

    // Test API connection
    testConnection: async (): Promise<boolean> => {
      try {
        await authenticate(credentials);
        return true;
      } catch {
        return false;
      }
    }
  };
};

export type { PetfinderAnimal };