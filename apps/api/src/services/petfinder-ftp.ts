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

// Petfinder CSV specification based on actual requirements
interface PetfinderCSVRecord {
  readonly animalID: string;          // Unique ID (required)
  readonly animalName: string;        // Pet name (required)
  readonly primaryBreed: string;      // Primary breed (required)
  readonly secondaryBreed: string;    // Secondary breed
  readonly animalSpecies: string;     // Dog/Cat (required)
  readonly animalSex: string;         // M/F (required)
  readonly animalGeneralAge: string;  // Baby/Young/Adult/Senior (required)
  readonly animalGeneralSizePotential: string; // S/M/L/XL (required)
  readonly animalDescription: string; // Description
  readonly animalStatus: string;      // Available/Hold/Adopted
  readonly animalshots: string;      // Y/N
  readonly animalAltered: string;     // Y/N (spayed/neutered)
  readonly animalHousetrained: string; // Y/N
  readonly animalDeclawed: string;    // Y/N
  readonly animalSpecialNeeds: string; // Y/N
  readonly animalMix: string;         // Y/N (mixed breed)
  readonly animalNoDogs: string;      // Y/N (opposite of good with dogs)
  readonly animalNoCats: string;      // Y/N (opposite of good with cats)
  readonly animalNoKids: string;      // Y/N (opposite of good with kids)
  readonly photo1: string;            // Photo URL
  readonly photo2: string;            // Photo URL
  readonly photo3: string;            // Photo URL
  readonly animalColor: string;       // Primary color
  readonly animalCoat: string;        // Coat type
  readonly animalPattern: string;     // Color pattern
  readonly rescueID: string;          // Optional rescue-specific ID
}

export interface PetfinderFTPService {
  uploadDog(dog: Dog): Promise<void>;
  uploadDogs(dogs: readonly Dog[]): Promise<void>;
  testConnection(): Promise<boolean>;
}

// Convert dog to Petfinder CSV format
const dogToPetfinderCSV = (dog: Dog): PetfinderCSVRecord => {
  const getPetfinderAge = (age: number): string => {
    if (age < 1) return 'Baby';
    if (age < 3) return 'Young';
    if (age < 8) return 'Adult';
    return 'Senior';
  };

  const getPetfinderSize = (size: string): string => {
    const sizeMap: Record<string, string> = {
      'SMALL': 'S',
      'MEDIUM': 'M',
      'LARGE': 'L',
      'XLARGE': 'XL'
    };
    return sizeMap[size] ?? 'M';
  };

  const getPetfinderGender = (gender: string): string => {
    const genderMap: Record<string, string> = {
      'MALE': 'M',
      'FEMALE': 'F',
      'UNKNOWN': 'M' // Default to M if unknown
    };
    return genderMap[gender] ?? 'M';
  };

  const getYesNo = (value: boolean | null | undefined): string => {
    return value === true ? 'Y' : 'N';
  };

  // Get opposite for "No" fields (Petfinder uses negative logic for some fields)
  const getNoValue = (value: boolean | null | undefined): string => {
    return value === false ? 'Y' : 'N';
  };

  const getPetfinderCoat = (coat?: string): string => {
    if (!coat) return '';
    const coatMap: Record<string, string> = {
      'HAIRLESS': 'Hairless',
      'SHORT': 'Short',
      'MEDIUM': 'Medium', 
      'LONG': 'Long',
      'WIRE': 'Wire',
      'CURLY': 'Curly'
    };
    return coatMap[coat] ?? '';
  };

  return {
    animalID: dog.id,
    animalName: dog.name,
    primaryBreed: dog.breed,
    secondaryBreed: dog.breedSecondary || '',
    animalSpecies: 'Dog',
    animalSex: getPetfinderGender(dog.gender),
    animalGeneralAge: getPetfinderAge(dog.age),
    animalGeneralSizePotential: getPetfinderSize(dog.size),
    animalDescription: dog.description || '',
    animalStatus: 'Available', // Always available for new uploads
    animalShots: getYesNo(dog.shotsCurrent),
    animalAltered: getYesNo(dog.spayedNeutered),
    animalHousetrained: getYesNo(dog.houseTrained),
    animalDeclawed: 'N', // Dogs are not declawed
    animalSpecialNeeds: getYesNo(dog.specialNeeds),
    animalMix: getYesNo(dog.breedMixed),
    animalNoDogs: getNoValue(dog.goodWithDogs),
    animalNoCats: getNoValue(dog.goodWithCats), 
    animalNoKids: getNoValue(dog.goodWithChildren),
    photo1: dog.photos[0] || '',
    photo2: dog.photos[1] || '',
    photo3: dog.photos[2] || '',
    animalColor: dog.colorPrimary || '',
    animalCoat: getPetfinderCoat(dog.coat),
    animalPattern: dog.colorSecondary || '',
    rescueID: dog.id // Use our internal ID as rescue ID
  };
};

const createCSVContent = (dogs: readonly Dog[]): string => {
  // CSV headers matching Petfinder specification
  const headers = [
    'animalID',
    'animalName', 
    'primaryBreed',
    'secondaryBreed',
    'animalSpecies',
    'animalSex',
    'animalGeneralAge',
    'animalGeneralSizePotential',
    'animalDescription',
    'animalStatus',
    'animalShots',
    'animalAltered',
    'animalHousetrained',
    'animalDeclawed',
    'animalSpecialNeeds',
    'animalMix',
    'animalNoDogs',
    'animalNoCats', 
    'animalNoKids',
    'photo1',
    'photo2',
    'photo3',
    'animalColor',
    'animalCoat',
    'animalPattern',
    'rescueID'
  ];

  const csvRows = dogs.map(dog => {
    const record = dogToPetfinderCSV(dog);
    return headers.map(header => {
      const value = record[header as keyof PetfinderCSVRecord] || '';
      // Escape CSV values properly
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
};

const generateFilename = (prefix: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
  return `${prefix}_${timestamp}.csv`;
};

export const createPetfinderFTPService = (config: PetfinderFTPConfig): PetfinderFTPService => {
  const connectToFTP = async (): Promise<FTPClient> => {
    const client = new FTPClient();
    client.ftp.verbose = true; // Enable logging for debugging
    
    try {
      await client.access({
        host: config.host,
        user: config.username,
        password: config.password,
        secure: false, // Most Petfinder FTP servers use regular FTP
        secureOptions: {
          rejectUnauthorized: false
        }
      });

      console.log(`Successfully connected to Petfinder FTP: ${config.host}`);
      return client;
    } catch (error) {
      console.error('FTP connection failed:', error);
      throw new Error(`Failed to connect to Petfinder FTP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    uploadDog: async (dog: Dog): Promise<void> => {
      const client = await connectToFTP();
      
      try {
        const csvContent = createCSVContent([dog]);
        const filename = generateFilename('pet_upload');

        console.log(`Uploading ${filename} to Petfinder FTP...`);
        console.log('CSV Content Preview:', csvContent.split('\n').slice(0, 3).join('\n'));

        // Navigate to import directory (standard for Petfinder)
        try {
          await client.ensureDir('import');
          console.log('Successfully navigated to import directory');
        } catch (dirError) {
          console.log('Import directory may not exist, uploading to root directory');
        }

        // Convert string to stream for upload
        const csvStream = Readable.from([csvContent]);
        await client.uploadFrom(csvStream, filename);
        
        console.log(`Successfully uploaded ${filename} to Petfinder FTP`);
        console.log('Note: Petfinder typically processes uploaded files within 1-2 hours');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('FTP upload error:', errorMessage);
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
        const filename = generateFilename('pets_bulk_upload');

        console.log(`Uploading bulk file ${filename} with ${dogs.length} dogs to Petfinder FTP...`);

        // Navigate to import directory
        try {
          await client.ensureDir('import');
          console.log('Successfully navigated to import directory');
        } catch (dirError) {
          console.log('Import directory may not exist, uploading to root directory');
        }

        // Convert string to stream for upload
        const csvStream = Readable.from([csvContent]);
        await client.uploadFrom(csvStream, filename);
        
        console.log(`Successfully uploaded ${dogs.length} dogs in ${filename} to Petfinder FTP`);
        console.log('Note: Petfinder typically processes uploaded files within 1-2 hours');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('FTP bulk upload error:', errorMessage);
        throw new Error(`Failed to upload bulk data to Petfinder FTP: ${errorMessage}`);
      } finally {
        client.close();
      }
    },

    testConnection: async (): Promise<boolean> => {
      let client: FTPClient | null = null;
      
      try {
        client = await connectToFTP();
        
        // Test directory listing
        const list = await client.list();
        console.log('FTP connection test successful. Available directories:', list.map(item => item.name));
        
        // Check for import directory
        const hasImportDir = list.some(item => item.name === 'import' && item.isDirectory);
        if (hasImportDir) {
          console.log('✓ Import directory found - uploads will go to /import/');
        } else {
          console.log('ℹ Import directory not found - uploads will go to root directory');
        }
        
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