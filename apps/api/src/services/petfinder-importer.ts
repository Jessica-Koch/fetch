// apps/api/src/services/petfinder-importer.ts
import { PrismaClient } from '@prisma/client';
import { DogStatus, Placement, Gender, Size, Coat } from '@fetch/shared';

interface PetfinderCredentials {
  clientId: string;
  clientSecret: string;
}

// Raw token response from Petfinder API (snake_case)
interface PetfinderApiToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Our internal token with computed expiry (camelCase)
interface PetfinderToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
}

// Raw Petfinder API response (snake_case as it comes from API)
interface PetfinderApiAnimal {
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
  published_at: string;
  distance?: number;
}

// Our camelCase version for internal use
interface PetfinderAnimal {
  id: number;
  organizationId: string;
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
    spayedNeutered: boolean;
    houseTrained: boolean;
    declawed?: boolean;
    specialNeeds: boolean;
    shotsCurrent: boolean;
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
  publishedAt: string;
  distance?: number;
}

interface PetfinderApiResponse {
  animals: PetfinderApiAnimal[];
  pagination: {
    count_per_page: number;
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

interface PetfinderResponse {
  animals: PetfinderAnimal[];
  pagination: {
    countPerPage: number;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

// Transform API response to camelCase
const transformAnimal = (apiAnimal: PetfinderApiAnimal): PetfinderAnimal => ({
  id: apiAnimal.id,
  organizationId: apiAnimal.organization_id,
  url: apiAnimal.url,
  type: apiAnimal.type,
  species: apiAnimal.species,
  breeds: apiAnimal.breeds,
  colors: apiAnimal.colors,
  age: apiAnimal.age,
  gender: apiAnimal.gender,
  size: apiAnimal.size,
  coat: apiAnimal.coat,
  name: apiAnimal.name,
  description: apiAnimal.description,
  photos: apiAnimal.photos,
  videos: apiAnimal.videos,
  status: apiAnimal.status,
  attributes: {
    spayedNeutered: apiAnimal.attributes.spayed_neutered,
    houseTrained: apiAnimal.attributes.house_trained,
    declawed: apiAnimal.attributes.declawed,
    specialNeeds: apiAnimal.attributes.special_needs,
    shotsCurrent: apiAnimal.attributes.shots_current,
  },
  environment: apiAnimal.environment,
  tags: apiAnimal.tags,
  contact: apiAnimal.contact,
  publishedAt: apiAnimal.published_at,
  distance: apiAnimal.distance,
});

const transformApiResponse = (
  apiResponse: PetfinderApiResponse
): PetfinderResponse => ({
  animals: apiResponse.animals.map(transformAnimal),
  pagination: {
    countPerPage: apiResponse.pagination.count_per_page,
    totalCount: apiResponse.pagination.total_count,
    currentPage: apiResponse.pagination.current_page,
    totalPages: apiResponse.pagination.total_pages,
  },
});

// Token storage (in production, use Redis or database)
let tokenCache: PetfinderToken | null = null;

const BASE_URL = 'https://api.petfinder.com/v2';

const isTokenValid = (
  token: PetfinderToken | null
): token is PetfinderToken => {
  return token !== null && Date.now() < token.expiresAt;
};

const authenticate = async (
  credentials: PetfinderCredentials
): Promise<PetfinderToken> => {
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

  const tokenData: PetfinderApiToken = await response.json();
  const newToken: PetfinderToken = {
    accessToken: tokenData.access_token,
    tokenType: tokenData.token_type,
    expiresIn: tokenData.expires_in,
    expiresAt: Date.now() + tokenData.expires_in * 1000 - 60000, // 1 minute buffer
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
      Authorization: `Bearer ${token.accessToken}`,
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

// Convert Petfinder animal to our Dog model
const convertPetfinderToDog = (
  animal: PetfinderAnimal
): {
  name: string;
  breed: string;
  breedSecondary?: string;
  breedMixed: boolean;
  breedUnknown: boolean;
  age: number;
  weight?: number;
  description?: string;
  gender: keyof typeof Gender;
  size: keyof typeof Size;
  coat?: keyof typeof Coat;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  status: keyof typeof DogStatus;
  placement: keyof typeof Placement;
  spayedNeutered: boolean;
  houseTrained: boolean;
  declawed?: boolean;
  specialNeeds: boolean;
  shotsCurrent: boolean;
  goodWithChildren?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  photos: string[];
  videos: string[];
  tags: string[];
  petfinderId: string;
  postedToPetfinder: boolean;
  contactEmail?: string;
  contactPhone?: string;
} => {
  // Convert Petfinder age to our numeric age (approximate)
  const convertAge = (ageStr: string): number => {
    switch (ageStr.toLowerCase()) {
      case 'baby':
        return 0.5;
      case 'young':
        return 2;
      case 'adult':
        return 5;
      case 'senior':
        return 10;
      default:
        return 5;
    }
  };

  // Convert gender
  const convertGender = (gender: string): keyof typeof Gender => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'MALE';
      case 'female':
        return 'FEMALE';
      default:
        return 'UNKNOWN';
    }
  };

  // Convert size
  const convertSize = (size: string): keyof typeof Size => {
    switch (size.toLowerCase()) {
      case 'small':
        return 'SMALL';
      case 'medium':
        return 'MEDIUM';
      case 'large':
        return 'LARGE';
      case 'extra large':
      case 'xlarge':
        return 'XLARGE';
      default:
        return 'MEDIUM';
    }
  };

  // Convert coat
  const convertCoat = (coat?: string): keyof typeof Coat | undefined => {
    if (!coat) return undefined;

    switch (coat.toLowerCase()) {
      case 'hairless':
        return 'HAIRLESS';
      case 'short':
        return 'SHORT';
      case 'medium':
        return 'MEDIUM';
      case 'long':
        return 'LONG';
      case 'wire':
        return 'WIRE';
      case 'curly':
        return 'CURLY';
      default:
        return undefined;
    }
  };

  return {
    name: animal.name,
    breed: animal.breeds.primary,
    breedSecondary: animal.breeds.secondary,
    breedMixed: animal.breeds.mixed,
    breedUnknown: animal.breeds.unknown,
    age: convertAge(animal.age),
    weight: undefined, // Not provided by Petfinder API
    description: animal.description,
    gender: convertGender(animal.gender),
    size: convertSize(animal.size),
    coat: convertCoat(animal.coat),
    colorPrimary: animal.colors.primary,
    colorSecondary: animal.colors.secondary,
    colorTertiary: animal.colors.tertiary,
    status: 'AVAILABLE', // Assume available since they're on Petfinder
    placement: 'IN_FOSTER', // Default assumption for rescue
    spayedNeutered: animal.attributes.spayedNeutered,
    houseTrained: animal.attributes.houseTrained,
    declawed: animal.attributes.declawed,
    specialNeeds: animal.attributes.specialNeeds,
    shotsCurrent: animal.attributes.shotsCurrent,
    goodWithChildren: animal.environment.children,
    goodWithDogs: animal.environment.dogs,
    goodWithCats: animal.environment.cats,
    photos: animal.photos.map(
      (photo) => photo.large || photo.medium || photo.small
    ),
    videos: animal.videos.map((video) => video.embed),
    tags: animal.tags,
    petfinderId: animal.id.toString(),
    postedToPetfinder: true,
    contactEmail: animal.contact.email,
    contactPhone: animal.contact.phone,
  };
};

export const createPetfinderImporter = (
  credentials: PetfinderCredentials,
  prisma: PrismaClient
) => {
  return {
    // Import dogs from a specific organization
    importFromOrganization: async (
      organizationId: string
    ): Promise<{
      imported: number;
      skipped: number;
      errors: string[];
    }> => {
      console.log(`Starting import from organization: ${organizationId}`);

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        try {
          console.log(`Fetching page ${currentPage}...`);

          const apiResponse = await makeRequest<PetfinderApiResponse>(
            `/animals?organization=${organizationId}&type=dog&status=adoptable&limit=100&page=${currentPage}`,
            credentials
          );

          const response = transformApiResponse(apiResponse);

          for (const animal of response.animals) {
            try {
              // Check if dog already exists
              const existingDog = await prisma.dog.findUnique({
                where: { petfinderId: animal.id.toString() },
              });

              if (existingDog) {
                console.log(`Skipping ${animal.name} - already exists`);
                skipped++;
                continue;
              }

              // Convert and create dog
              const dogData = convertPetfinderToDog(animal);

              await prisma.dog.create({
                data: dogData,
              });

              console.log(`✅ Imported: ${animal.name}`);
              imported++;
            } catch (error) {
              const errorMsg = `Failed to import ${animal.name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }

          // Check if there are more pages
          hasMorePages = currentPage < response.pagination.totalPages;
          currentPage++;

          // Add delay to avoid rate limiting
          if (hasMorePages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          const errorMsg = `Failed to fetch page ${currentPage}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          console.error(errorMsg);
          errors.push(errorMsg);
          break;
        }
      }

      console.log(
        `Import complete: ${imported} imported, ${skipped} skipped, ${errors.length} errors`
      );
      return { imported, skipped, errors };
    },

    // Import dogs from search criteria
    importFromSearch: async (searchParams: {
      location?: string;
      breed?: string;
      age?: string;
      size?: string;
      gender?: string;
      distance?: number;
    }): Promise<{
      imported: number;
      skipped: number;
      errors: string[];
    }> => {
      console.log('Starting import from search criteria:', searchParams);

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      // Build query parameters
      const queryParams = new URLSearchParams({
        type: 'dog',
        status: 'adoptable',
        limit: '100',
        page: currentPage.toString(),
      });

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      while (hasMorePages) {
        try {
          queryParams.set('page', currentPage.toString());

          console.log(`Fetching page ${currentPage}...`);

          const apiResponse = await makeRequest<PetfinderApiResponse>(
            `/animals?${queryParams.toString()}`,
            credentials
          );

          const response = transformApiResponse(apiResponse);

          for (const animal of response.animals) {
            try {
              // Check if dog already exists
              const existingDog = await prisma.dog.findUnique({
                where: { petfinderId: animal.id.toString() },
              });

              if (existingDog) {
                console.log(`Skipping ${animal.name} - already exists`);
                skipped++;
                continue;
              }

              // Convert and create dog
              const dogData = convertPetfinderToDog(animal);

              await prisma.dog.create({
                data: dogData,
              });

              console.log(
                `✅ Imported: ${animal.name} from ${animal.organizationId}`
              );
              imported++;
            } catch (error) {
              const errorMsg = `Failed to import ${animal.name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }

          // Check if there are more pages
          hasMorePages = currentPage < response.pagination.totalPages;
          currentPage++;

          // Add delay to avoid rate limiting
          if (hasMorePages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          const errorMsg = `Failed to fetch page ${currentPage}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          console.error(errorMsg);
          errors.push(errorMsg);
          break;
        }
      }

      console.log(
        `Import complete: ${imported} imported, ${skipped} skipped, ${errors.length} errors`
      );
      return { imported, skipped, errors };
    },

    // Test connection
    testConnection: async (): Promise<boolean> => {
      try {
        await authenticate(credentials);
        return true;
      } catch {
        return false;
      }
    },
  };
};
