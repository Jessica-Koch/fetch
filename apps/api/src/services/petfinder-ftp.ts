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

// Petfinder CSV specification - Official Import Standard Template
// CSV must be in exact order as specified by Petfinder documentation
interface PetfinderCSVRecord {
  readonly ID: string;                 // Unique Pet ID (required)
  readonly Internal: string;           // Internal field - can be anything
  readonly AnimalName: string;         // Pet name (required)
  readonly PrimaryBreed: string;       // Primary breed (required) - see breeds doc
  readonly SecondaryBreed: string;     // Secondary breed - see breeds doc
  readonly Sex: string;                // M, F (required)
  readonly Size: string;               // S, M, L, XL (required)
  readonly Age: string;                // Baby, Young, Adult, Senior (required)
  readonly Desc: string;               // Description - plain text, use &#10; for line breaks
  readonly Type: string;               // "Dog", "Cat", "Barnyard", etc. (required)
  readonly Status: string;             // A, H, X, P, F (A=adoptable, H=hold, X=adopted, P=pending, F=found)
  readonly Shots: string;              // 1 or blank
  readonly Altered: string;            // 1 or blank (spayed/neutered)
  readonly NoDogs: string;             // 1/y/yes/t/true = Not good fit, 0/n/no/f/false = Good fit, blank = Unknown
  readonly NoCats: string;             // 1/y/yes/t/true = Not good fit, 0/n/no/f/false = Good fit, blank = Unknown
  readonly NoKids: string;             // 1/y/yes/t/true = Not good fit, 0/n/no/f/false = Good fit, blank = Unknown
  readonly Housetrained: string;       // 1 or blank
  readonly Declawed: string;           // 1 or blank (dogs cannot be declawed)
  readonly specialNeeds: string;       // 1 or blank
  readonly Mix: string;                // 1 or blank (mixed breed)
  readonly photo1: string;             // Photo URL or file reference
  readonly photo2: string;             // Photo URL or file reference
  readonly photo3: string;             // Photo URL or file reference
  readonly photo4: string;             // Photo URL or file reference
  readonly photo5: string;             // Photo URL or file reference
  readonly photo6: string;             // Photo URL or file reference
  readonly arrival_date: string;       // YYYY-MM-DD format
  readonly birth_date: string;         // YYYY-MM-DD format
  readonly primaryColor: string;       // See breeds/coat/color documentation
  readonly secondaryColor: string;     // See breeds/coat/color documentation
  readonly tertiaryColor: string;      // See breeds/coat/color documentation
  readonly coat_length: string;        // See breeds/coat/color documentation
  readonly adoption_fee: string;       // Numeric, can have decimal, no $ or commas
  readonly display_adoption_fee: string; // 1/y/yes/t/true or 0/n/no/f/false
  readonly adoption_fee_waived: string; // 1/y/yes/t/true or 0/n/no/f/false
  readonly special_needs_notes: string; // Text description if specialNeeds is true
  readonly no_other: string;           // Not good fit w/ other pets: 1/y/yes/t/true or 0/n/no/f/false
  readonly no_other_note: string;      // Description if no_other is true
  readonly tags: string;               // Personality traits: comma-delimited list in quotes
}

export interface PetfinderFTPService {
  uploadDog(dog: Dog): Promise<void>;
  uploadDogs(dogs: readonly Dog[]): Promise<void>;
  uploadPhoto(petId: string, photoBuffer: Buffer, photoIndex: number): Promise<string>;
  testConnection(): Promise<boolean>;
}

// Convert dog to Petfinder CSV format using official specification
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

  // Convert boolean to 1 or blank (Petfinder format)
  const getBooleanValue = (value: boolean | null | undefined): string => {
    return value === true ? '1' : '';
  };

  // Convert good with values to Petfinder format
  // 1 = Not good fit, 0 = Good fit, blank = Unknown
  const getGoodWithValue = (value: boolean | null | undefined): string => {
    if (value === true) return '0';  // Good fit
    if (value === false) return '1'; // Not good fit
    return '';  // Unknown
  };

  // Format description with proper line breaks
  const formatDescription = (desc: string | null | undefined): string => {
    if (!desc) return '';
    // Replace newlines with Petfinder's HTML entity for line breaks
    return desc.replace(/\n/g, '&#10;');
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date?: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  // Convert internal coat enum to Petfinder format
  const getPetfinderCoatLength = (coat: string | null | undefined): string => {
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

  // Generate tags from available dog properties
  const generateTags = (dog: Dog): string => {
    const tags: string[] = [];
    if (dog.goodWithDogs === true) tags.push('good with dogs');
    if (dog.goodWithCats === true) tags.push('good with cats');
    if (dog.goodWithChildren === true) tags.push('good with kids');
    if (dog.houseTrained === true) tags.push('house trained');
    if (dog.specialNeeds === true) tags.push('special needs');
    // Add existing tags from the dog record
    if (dog.tags && dog.tags.length > 0) {
      tags.push(...dog.tags);
    }
    return tags.join(', ');
  };

  return {
    ID: dog.id,
    Internal: dog.id, // Use our ID as internal reference
    AnimalName: dog.name,
    PrimaryBreed: dog.breed,
    SecondaryBreed: dog.breedSecondary || '',
    Sex: getPetfinderGender(dog.gender),
    Size: getPetfinderSize(dog.size),
    Age: getPetfinderAge(dog.age),
    Desc: formatDescription(dog.description),
    Type: 'Dog',
    Status: 'A', // A = adoptable (default for new uploads)
    Shots: getBooleanValue(dog.shotsCurrent),
    Altered: getBooleanValue(dog.spayedNeutered),
    NoDogs: getGoodWithValue(dog.goodWithDogs),
    NoCats: getGoodWithValue(dog.goodWithCats),
    NoKids: getGoodWithValue(dog.goodWithChildren),
    Housetrained: getBooleanValue(dog.houseTrained),
    Declawed: '', // Dogs cannot be declawed
    specialNeeds: getBooleanValue(dog.specialNeeds),
    Mix: getBooleanValue(dog.breedMixed),
    photo1: dog.photos[0] || '',
    photo2: dog.photos[1] || '',
    photo3: dog.photos[2] || '',
    photo4: dog.photos[3] || '',
    photo5: dog.photos[4] || '',
    photo6: dog.photos[5] || '',
    arrival_date: '', // Not available in our schema
    birth_date: '', // Calculate from age if needed
    primaryColor: dog.colorPrimary || '',
    secondaryColor: dog.colorSecondary || '',
    tertiaryColor: dog.colorTertiary || '',
    coat_length: getPetfinderCoatLength(dog.coat),
    adoption_fee: '', // Not available in our schema
    display_adoption_fee: '0', // Not available in our schema
    adoption_fee_waived: '', // Not available in our schema
    special_needs_notes: dog.specialNeeds ? 'Special needs - see description' : '',
    no_other: '', // Not available in our schema
    no_other_note: '',
    tags: generateTags(dog)
  };
};

const createCSVContent = (dogs: readonly Dog[]): string => {
  // CSV headers in EXACT order as specified by Petfinder Import Standard Template
  const headers = [
    'ID',
    'Internal',
    'AnimalName',
    'PrimaryBreed',
    'SecondaryBreed',
    'Sex',
    'Size',
    'Age',
    'Desc',
    'Type',
    'Status',
    'Shots',
    'Altered',
    'NoDogs',
    'NoCats',
    'NoKids',
    'Housetrained',
    'Declawed',
    'specialNeeds',
    'Mix',
    'photo1',
    'photo2',
    'photo3',
    'photo4',
    'photo5',
    'photo6',
    'arrival_date',
    'birth_date',
    'primaryColor',
    'secondaryColor',
    'tertiaryColor',
    'coat_length',
    'adoption_fee',
    'display_adoption_fee',
    'adoption_fee_waived',
    'special_needs_notes',
    'no_other',
    'no_other_note',
    'tags'
  ];

  const csvRows = dogs.map(dog => {
    const record = dogToPetfinderCSV(dog);
    return headers.map(header => {
      const value = record[header as keyof PetfinderCSVRecord] || '';
      // All values must be surrounded by double quotes per Petfinder spec
      return `"${value.toString().replace(/"/g, '""')}"`;
    }).join(',');
  });

  return csvRows.join('\n');
};

const generateFilename = (organizationId: string): string => {
  // Petfinder requires filename format: SHELTERID.csv (with state abbreviation in CAPS)
  // For now, use the organizationId. In production, this should be the actual shelter ID
  return `${organizationId.toUpperCase()}.csv`;
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
        const filename = generateFilename(config.organizationId);

        console.log(`Uploading ${filename} to Petfinder FTP...`);
        console.log('CSV Content Preview:', csvContent.split('\n').slice(0, 3).join('\n'));

        // Navigate to import directory (required by Petfinder specification)
        try {
          await client.ensureDir('import');
          console.log('Successfully navigated to /import directory');
        } catch (dirError) {
          console.warn('Could not access /import directory, creating it...');
          try {
            await client.ensureDir('import');
          } catch (createError) {
            throw new Error('Unable to access or create /import directory required by Petfinder');
          }
        }

        // Convert string to stream for upload
        const csvStream = Readable.from([csvContent]);
        const ftpResp = await client.uploadFrom(csvStream, filename);
        console.log('FTP_RESP: ', ftpResp)
        console.log(`✅ SUCCESS: Uploaded ${filename} to Petfinder FTP`);
        console.log(`📊 Upload Details:`);
        console.log(`   - Dog ID: ${dog.id}`);
        console.log(`   - Dog Name: ${dog.name}`);
        console.log(`   - File: ${filename}`);
        console.log(`   - FTP Response: ${ftpResp.code} - ${ftpResp.message}`);
        console.log(`⏳ Next Steps:`);
        console.log(`   - Wait 1-2 hours for Petfinder processing`);
        console.log(`   - Check ${dog.name} appears on petfinder.com`);
        console.log(`   - Monitor database petfinderSyncStatus field`);
        
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
        const filename = generateFilename(config.organizationId);

        console.log(`Uploading bulk file ${filename} with ${dogs.length} dogs to Petfinder FTP...`);

        // Navigate to import directory (required by Petfinder specification)
        try {
          await client.ensureDir('import');
          console.log('Successfully navigated to /import directory');
        } catch (dirError) {
          console.warn('Could not access /import directory, creating it...');
          try {
            await client.ensureDir('import');
          } catch (createError) {
            throw new Error('Unable to access or create /import directory required by Petfinder');
          }
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

    uploadPhoto: async (petId: string, photoBuffer: Buffer, photoIndex: number): Promise<string> => {
      const client = await connectToFTP();
      
      try {
        // Ensure import/photos directory exists (required by Petfinder)
        await client.ensureDir('import');
        await client.ensureDir('import/photos');
        console.log('Successfully navigated to /import/photos directory');
        
        // Photo filename format: ID-sortorder.jpg (per Petfinder spec)
        const filename = `${petId}-${photoIndex}.jpg`;
        
        console.log(`Uploading photo ${filename} to Petfinder FTP...`);
        
        // Convert buffer to stream for upload
        const photoStream = Readable.from(photoBuffer);
        await client.uploadFrom(photoStream, filename);
        
        console.log(`✅ SUCCESS: Uploaded photo ${filename} to /import/photos/`);
        return filename;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Photo upload error:', errorMessage);
        throw new Error(`Failed to upload photo to Petfinder FTP: ${errorMessage}`);
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
        
        // Check for required Petfinder directories
        const hasImportDir = list.some(item => item.name === 'import' && item.isDirectory);
        if (hasImportDir) {
          console.log('✓ /import directory found');
          
          // Check for photos subdirectory
          await client.cd('import');
          const importContents = await client.list();
          const hasPhotosDir = importContents.some(item => item.name === 'photos' && item.isDirectory);
          
          if (hasPhotosDir) {
            console.log('✓ /import/photos directory found');
          } else {
            console.log('ℹ /import/photos directory not found - will be created on first photo upload');
          }
          
          await client.cd('..');
        } else {
          console.log('ℹ /import directory not found - will be created on first upload');
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