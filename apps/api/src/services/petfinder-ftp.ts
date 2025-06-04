// apps/api/src/services/petfinder-ftp.ts
import { Client as FTPClient } from 'basic-ftp';
import { Readable } from 'stream';
import type { Dog } from '@fetch/shared';

export interface PetfinderFTPConfig {
  readonly host: string;
  readonly username: string;
  readonly password: string;
  readonly organizationId: string;
}

interface PetfinderCSVRow {
  readonly id: string;
  readonly name: string;
  readonly breed1: string;
  readonly breed2: string;
  readonly mixed: 'Y' | 'N';
  readonly age: 'Baby' | 'Young' | 'Adult' | 'Senior';
  readonly gender: 'M' | 'F' | 'U';
  readonly size: 'S' | 'M' | 'L' | 'XL';
  readonly color1: string;
  readonly color2: string;
  readonly description: string;
  readonly altered: 'Y' | 'N' | 'U';
  readonly houseTrained: 'Y' | 'N' | 'U';
  readonly shots: 'Y' | 'N' | 'U';
  readonly specialNeeds: 'Y' | 'N' | 'U';
  readonly goodWithKids: 'Y' | 'N' | 'U';
  readonly goodWithDogs: 'Y' | 'N' | 'U';
  readonly goodWithCats: 'Y' | 'N' | 'U';
  readonly email: string;
  readonly phone: string;
  readonly photos: string;
  readonly tags: string;
  readonly status: 'A' | 'P' | 'X';
  readonly dateAdded: string;
}

export interface PetfinderFTPService {
  uploadDog(dog: Dog): Promise<void>;
  uploadDogs(dogs: readonly Dog[]): Promise<void>;
  testConnection(): Promise<boolean>;
}

// Convert dog to Petfinder CSV format
const dogToPetfinderCSV = (dog: Dog): string => {
  const getPetfinderAge = (age: number): PetfinderCSVRow['age'] => {
    if (age < 1) return 'Baby';
    if (age < 3) return 'Young';
    if (age < 8) return 'Adult';
    return 'Senior';
  };

  const getPetfinderSize = (size: string): PetfinderCSVRow['size'] => {
    const sizeMap: Record<string, PetfinderCSVRow['size']> = {
      'SMALL': 'S',
      'MEDIUM': 'M',
      'LARGE': 'L',
      'XLARGE': 'XL'
    } as const;
    return sizeMap[size] ?? 'M';
  };

  const getPetfinderGender = (gender: string): PetfinderCSVRow['gender'] => {
    const genderMap: Record<string, PetfinderCSVRow['gender']> = {
      'MALE': 'M',
      'FEMALE': 'F',
      'UNKNOWN': 'U'
    } as const;
    return genderMap[gender] ?? 'U';
  };

  const getYesNoUnknown = (value: boolean | null): 'Y' | 'N' | 'U' => {
    if (value === true) return 'Y';
    if (value === false) return 'N';
    return 'U';
  };

  const csvRow: PetfinderCSVRow = {
    id: dog.id,
    name: dog.name,
    breed1: dog.breed,
    breed2: dog.breedSecondary ?? '',
    mixed: dog.breedMixed ? 'Y' : 'N',
    age: getPetfinderAge(dog.age),
    gender: getPetfinderGender(dog.gender),
    size: getPetfinderSize(dog.size),
    color1: dog.colorPrimary ?? '',
    color2: dog.colorSecondary ?? '',
    description: dog.description ?? '',
    altered: getYesNoUnknown(dog.spayedNeutered),
    houseTrained: getYesNoUnknown(dog.houseTrained),
    shots: getYesNoUnknown(dog.shotsCurrent),
    specialNeeds: getYesNoUnknown(dog.specialNeeds),
    goodWithKids: getYesNoUnknown(dog.goodWithChildren),
    goodWithDogs: getYesNoUnknown(dog.goodWithDogs),
    goodWithCats: getYesNoUnknown(dog.goodWithCats),
    email: dog.contactEmail ?? '',
    phone: dog.contactPhone ?? '',
    photos: dog.photos.join('|'),
    tags: dog.tags.join(','),
    status: 'A',
    dateAdded: new Date().toISOString().split('T')[0]!
  };

  return Object.values(csvRow)
    .map((field): string => `"${String(field).replace(/"/g, '""')}"`)
    .join(',');
};

const createCSVContent = (dogs: readonly Dog[]): string => {
  const headers: readonly (keyof PetfinderCSVRow)[] = [
    'id', 'name', 'breed1', 'breed2', 'mixed', 'age', 'gender', 'size',
    'color1', 'color2', 'description', 'altered', 'houseTrained', 'shots',
    'specialNeeds', 'goodWithKids', 'goodWithDogs', 'goodWithCats',
    'email', 'phone', 'photos', 'tags', 'status', 'dateAdded'
  ] as const;

  const csvHeader = headers.join(',');
  const csvRows = dogs.map(dogToPetfinderCSV);
  
  return [csvHeader, ...csvRows].join('\n');
};

const generateFilename = (prefix: string, dogId?: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dogPart = dogId ? `_${dogId}` : '';
  return `${prefix}${dogPart}_${timestamp}.csv`;
};

export const createPetfinderFTPService = (config: PetfinderFTPConfig): PetfinderFTPService => {
  const connectToFTP = async (): Promise<FTPClient> => {
    const client = new FTPClient();
    
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false // Set to true if using FTPS
    });

    return client;
  };

  return {
    uploadDog: async (dog: Dog): Promise<void> => {
      const client = await connectToFTP();
      
      try {
        const csvContent = createCSVContent([dog]);
        const filename = generateFilename('dog', dog.id);

        // FIX: Convert string to Readable stream instead of using Buffer
        const csvStream = Readable.from([csvContent]);
        await client.uploadFrom(csvStream, filename);
        
        console.log(`Successfully uploaded ${filename} to Petfinder FTP`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to upload to Petfinder FTP: ${errorMessage}`);
      } finally {
        client.close();
      }
    },

    uploadDogs: async (dogs: readonly Dog[]): Promise<void> => {
      if (dogs.length === 0) {
        throw new Error('No dogs provided for upload');
      }

      const client = await connectToFTP();
      
      try {
        const csvContent = createCSVContent(dogs);
        const filename = generateFilename('dogs_bulk');

        // FIX: Convert string to Readable stream instead of using Buffer
        const csvStream = Readable.from([csvContent]);
        await client.uploadFrom(csvStream, filename);
        
        console.log(`Successfully uploaded ${dogs.length} dogs in ${filename} to Petfinder FTP`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to upload to Petfinder FTP: ${errorMessage}`);
      } finally {
        client.close();
      }
    },

    testConnection: async (): Promise<boolean> => {
      let client: FTPClient | null = null;
      
      try {
        client = await connectToFTP();
        await client.list(); // Try to list directory
        return true;
      } catch (error) {
        console.error('FTP connection test failed:', error);
        return false;
      } finally {
        if (client) {
          client.close();
        }
      }
    }
  };
};