// apps/api/src/services/petfinder-upload.ts
import { createPetfinderFTPService } from './petfinder-ftp.js';
import type { Dog } from '@fetch/shared';

export type UploadMethod = 'ftp' | 'auto';

interface PetfinderUploadConfig {
  // FTP credentials (for CSV uploads)
  ftp: {
    host: string;
    username: string;
    password: string;
  };
  organizationId: string;
  defaultMethod: UploadMethod;
}

export interface UploadResult {
  success: boolean;
  method: 'ftp' | '';
  petfinderId?: string;
  error?: string;
  message: string;
  manualUploadUrl?: string;
}

export const createPetfinderUploadService = (config: PetfinderUploadConfig) => {
  const ftpService = createPetfinderFTPService({
    host: config.ftp.host,
    username: config.ftp.username,
    password: config.ftp.password,
    organizationId: config.organizationId,
  });

  const testConnections = async () => {
    const results = {
      ftp: false,
    };

    try {
      results.ftp = await ftpService.testConnection();
    } catch (error) {
      console.warn('FTP connection test failed:', error);
    }

    return results;
  };

  const determineMethod = async (
    preferredMethod: UploadMethod
  ): Promise<'ftp'> => {
    if (preferredMethod === 'ftp') return 'ftp';

    // Auto mode - test both and pick the best
    const connections = await testConnections();

    if (connections.ftp) {
      // Both work - prefer FTP (more reliable and faster processing)
      return 'ftp';
    } else if (connections.ftp) {
      return 'ftp';
    } else {
      throw new Error(' FTP connections are not working');
    }
  };

  return {
    // Upload a single dog with method selection
    uploadDog: async (
      dog: Dog,
      method: UploadMethod = config.defaultMethod
    ): Promise<UploadResult> => {
      try {
        const selectedMethod = await determineMethod(method);

        if (selectedMethod === 'ftp') {
          await ftpService.uploadDog(dog);
          return {
            success: true,
            method: 'ftp',
            message: `Successfully uploaded ${dog.name} via FTP. Petfinder will process the file within 1-2 hours.`,
          };
        }

        // Fallback return if no method is handled
        return {
          success: false,
          method: '',
          error: 'No valid upload method available',
          message: `Failed to upload ${dog.name}: No valid upload method available`,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const actualMethod = method === 'auto' ? 'ftp' : (method as 'ftp' | '');
        return {
          success: false,
          method: actualMethod,
          error: errorMessage,
          message: `Failed to upload ${dog.name}: ${errorMessage}`,
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
          message: `Successfully uploaded ${dogs.length} dogs via FTP. Petfinder will process the file within 1-2 hours.`,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          method: 'ftp',
          error: errorMessage,
          message: `Failed to upload ${dogs.length} dogs: ${errorMessage}`,
        };
      }
    },

    // Upload with fallback (try one method, fall back to the other)
    uploadDogWithFallback: async (dog: Dog): Promise<UploadResult> => {
      // Try FTP first (more reliable)
      try {
        const ftpConnected = await ftpService.testConnection();

        if (ftpConnected) {
          await ftpService.uploadDog(dog);
          return {
            success: true,
            method: 'ftp',
            message: `Successfully uploaded ${dog.name} via FTP. Petfinder will process the file within 1-2 hours.`,
          };
        }
      } catch (error) {
        console.log('FTP upload failed, trying  fallback...', error);
      }

      // If all methods fail, return an error
      return {
        success: false,
        method: 'ftp',
        error: 'All upload methods failed',
        message: `Failed to upload ${dog.name}: All upload methods failed`,
      };
    },

    // Test both connection methods
    testConnections,

    // Get available methods
    getAvailableMethods: async (): Promise<{
      ftp: boolean;
      recommended: 'ftp' | 'none';
    }> => {
      const connections = await testConnections();

      let recommended: 'ftp' | 'none' = 'none';
      if (connections.ftp) {
        recommended = 'ftp';
      }
      return {
        ...connections,
        recommended,
      };
    },
  };
};
