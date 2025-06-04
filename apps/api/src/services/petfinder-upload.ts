// apps/api/src/services/petfinder-upload.ts
import { createPetfinderFTPService } from './petfinder-ftp';
import { createPetfinderScraper } from './petfinder-scraper';
import type { Dog } from '@fetch/shared';

export type UploadMethod = 'ftp' | 'scraper' | 'auto';

interface PetfinderUploadConfig {
  // FTP credentials
  ftp: {
    host: string;
    username: string;
    password: string;
  };
  // Scraper credentials  
  scraper: {
    username: string;
    password: string;
  };
  organizationId: string;
  defaultMethod: UploadMethod;
}

export interface UploadResult {
  success: boolean;
  method: 'ftp' | 'scraper';
  petfinderId?: string;
  error?: string;
  message: string;
}

export const createPetfinderUploadService = (config: PetfinderUploadConfig) => {
  const ftpService = createPetfinderFTPService({
    host: config.ftp.host,
    username: config.ftp.username,
    password: config.ftp.password,
    organizationId: config.organizationId
  });

  const scraperService = createPetfinderScraper({
    username: config.scraper.username,
    password: config.scraper.password,
    organizationId: config.organizationId,
    headless: true
  });

  const testConnections = async () => {
    const results = {
      ftp: false,
      scraper: false
    };

    try {
      results.ftp = await ftpService.testConnection();
    } catch (error) {
      console.warn('FTP connection test failed:', error);
    }

    try {
      results.scraper = await scraperService.testConnection();
    } catch (error) {
      console.warn('Scraper connection test failed:', error);
    }

    return results;
  };

  const determineMethod = async (preferredMethod: UploadMethod): Promise<'ftp' | 'scraper'> => {
    if (preferredMethod === 'ftp') return 'ftp';
    if (preferredMethod === 'scraper') return 'scraper';
    
    // Auto mode - test both and pick the best
    const connections = await testConnections();
    
    if (connections.ftp && connections.scraper) {
      // Both work - prefer FTP (more reliable)
      return 'ftp';
    } else if (connections.ftp) {
      return 'ftp';
    } else if (connections.scraper) {
      return 'scraper';
    } else {
      throw new Error('Neither FTP nor scraper connections are working');
    }
  };

  return {
    // Upload a single dog with method selection
    uploadDog: async (dog: Dog, method: UploadMethod = config.defaultMethod): Promise<UploadResult> => {
      try {
        const selectedMethod = await determineMethod(method);
        
        if (selectedMethod === 'ftp') {
          await ftpService.uploadDog(dog);
          return {
            success: true,
            method: 'ftp',
            message: `Successfully uploaded ${dog.name} via FTP. Processing may take a few hours.`
          };
        } else {
          const petfinderId = await scraperService.uploadDog(dog);
          return {
            success: true,
            method: 'scraper',
            petfinderId,
            message: `Successfully uploaded ${dog.name} via web scraper. Petfinder ID: ${petfinderId}`
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const actualMethod = method === 'auto' ? 'ftp' : method as 'ftp' | 'scraper';
        return {
          success: false,
          method: actualMethod,
          error: errorMessage,
          message: `Failed to upload ${dog.name}: ${errorMessage}`
        };
      }
    },

    // Upload multiple dogs (FTP only - more efficient for bulk)
    uploadDogs: async (dogs: Dog[]): Promise<UploadResult> => {
      try {
        // For bulk uploads, always use FTP (more efficient)
        const connections = await testConnections();
        if (!connections.ftp) {
          throw new Error('FTP connection not available for bulk upload');
        }

        await ftpService.uploadDogs(dogs);
        return {
          success: true,
          method: 'ftp',
          message: `Successfully uploaded ${dogs.length} dogs via FTP. Processing may take a few hours.`
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          method: 'ftp',
          error: errorMessage,
          message: `Failed to upload ${dogs.length} dogs: ${errorMessage}`
        };
      }
    },

    // Upload with fallback (try one method, fall back to the other)
    uploadDogWithFallback: async (dog: Dog): Promise<UploadResult> => {
      // Try FTP first
      try {
        const selectedMethod = await determineMethod('ftp');
        
        if (selectedMethod === 'ftp') {
          await ftpService.uploadDog(dog);
          return {
            success: true,
            method: 'ftp',
            message: `Successfully uploaded ${dog.name} via FTP. Processing may take a few hours.`
          };
        }
      } catch (error) {
        console.log('FTP upload failed, trying scraper fallback...');
      }
      
      // Fall back to scraper
      try {
        const petfinderId = await scraperService.uploadDog(dog);
        return {
          success: true,
          method: 'scraper',
          petfinderId,
          message: `Successfully uploaded ${dog.name} via web scraper. Petfinder ID: ${petfinderId} (FTP failed, used scraper fallback)`
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          method: 'scraper',
          error: errorMessage,
          message: `Failed to upload ${dog.name}: ${errorMessage}`
        };
      }
    },

    // Test both connection methods
    testConnections,

    // Get available methods
    getAvailableMethods: async (): Promise<{ ftp: boolean; scraper: boolean; recommended: 'ftp' | 'scraper' | 'none' }> => {
      const connections = await testConnections();
      
      let recommended: 'ftp' | 'scraper' | 'none' = 'none';
      if (connections.ftp && connections.scraper) {
        recommended = 'ftp'; // Prefer FTP when both work
      } else if (connections.ftp) {
        recommended = 'ftp';
      } else if (connections.scraper) {
        recommended = 'scraper';
      }

      return {
        ...connections,
        recommended
      };
    },

    // Cleanup resources
    cleanup: async (): Promise<void> => {
      await scraperService.close();
    }
  };
};