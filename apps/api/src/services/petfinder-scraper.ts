// apps/api/src/services/petfinder-scraper.ts
import puppeteer, { Browser, Page } from 'puppeteer';
import type { Dog } from '@fetch/shared';

export interface PetfinderScraperConfig {
  readonly username: string;
  readonly password: string;
  readonly organizationId: string;
  readonly headless?: boolean;
  readonly timeout?: number;
}

export interface PetfinderScraperService {
  uploadDog(dog: Dog): Promise<string>;
  testConnection(): Promise<boolean>;
  close(): Promise<void>;
}

interface PetfinderFormData {
  readonly name: string;
  readonly animalType: 'Dog';
  readonly breedPrimary: string;
  readonly breedSecondary?: string;
  readonly gender: 'M' | 'F' | 'Unknown';
  readonly size: 'S' | 'M' | 'L' | 'XL';
  readonly age: 'Baby' | 'Young' | 'Adult' | 'Senior';
  readonly description?: string;
  readonly colorPrimary?: string;
  readonly colorSecondary?: string;
  readonly spayedNeutered: boolean;
  readonly houseTrained: boolean;
  readonly shotsCurrent: boolean;
  readonly specialNeeds: boolean;
  readonly goodWithChildren?: boolean;
  readonly goodWithDogs?: boolean;
  readonly goodWithCats?: boolean;
  readonly contactEmail?: string;
  readonly contactPhone?: string;
}

type FormSelector = string;
type FormValue = string | boolean;

interface FormField {
  readonly selector: FormSelector;
  readonly value: FormValue;
  readonly required?: boolean;
}

export const createPetfinderScraper = (config: PetfinderScraperConfig): PetfinderScraperService => {
  let browser: Browser | null = null;
  const defaultTimeout = config.timeout ?? 10000;

  const init = async (): Promise<Browser> => {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: config.headless ?? true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return browser;
  };

  const login = async (page: Page): Promise<void> => {
    console.log('Logging into Petfinder...');
    
    await page.goto('https://www.petfinder.com/user/login/', { 
      waitUntil: 'networkidle2',
      timeout: defaultTimeout 
    });
    
    // Wait for login form to load
    await page.waitForSelector('input[name="username"], input[type="email"]', { 
      timeout: defaultTimeout 
    });
    
    // Fill login form (try different selectors)
    try {
      await page.type('input[name="username"]', config.username);
    } catch {
      try {
        await page.type('input[type="email"]', config.username);
      } catch {
        throw new Error('Could not find username/email input field');
      }
    }
    
    await page.type('input[name="password"], input[type="password"]', config.password);
    
    // Submit form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: defaultTimeout }),
      page.click('button[type="submit"], input[type="submit"]')
    ]);
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('login')) {
      throw new Error('Login failed - check your credentials');
    }
    
    console.log('Successfully logged into Petfinder');
  };

  const navigateToAddPet = async (page: Page): Promise<void> => {
    console.log('Navigating to Add Pet page...');
    
    await page.goto('https://www.petfinder.com/pet-management/add-pet/', { 
      waitUntil: 'networkidle2',
      timeout: defaultTimeout 
    });
    
    await page.waitForSelector('form', { timeout: defaultTimeout });
  };

  const convertDogToFormData = (dog: Dog): PetfinderFormData => {
    const getGender = (gender: string): PetfinderFormData['gender'] => {
      const genderMap: Record<string, PetfinderFormData['gender']> = {
        'MALE': 'M',
        'FEMALE': 'F',
        'UNKNOWN': 'Unknown'
      } as const;
      return genderMap[gender] ?? 'Unknown';
    };

    const getSize = (size: string): PetfinderFormData['size'] => {
      const sizeMap: Record<string, PetfinderFormData['size']> = {
        'SMALL': 'S',
        'MEDIUM': 'M',
        'LARGE': 'L',
        'XLARGE': 'XL'
      } as const;
      return sizeMap[size] ?? 'M';
    };

    const getAge = (age: number): PetfinderFormData['age'] => {
      if (age < 1) return 'Baby';
      if (age < 3) return 'Young';
      if (age < 8) return 'Adult';
      return 'Senior';
    };

    // Helper function to convert null to undefined
    const nullToUndefined = <T>(value: T | null): T | undefined => {
      return value === null ? undefined : value;
    };

    return {
      name: dog.name,
      animalType: 'Dog',
      breedPrimary: dog.breed,
      breedSecondary: nullToUndefined(dog.breedSecondary),
      gender: getGender(dog.gender),
      size: getSize(dog.size),
      age: getAge(dog.age),
      description: nullToUndefined(dog.description),
      colorPrimary: nullToUndefined(dog.colorPrimary),
      colorSecondary: nullToUndefined(dog.colorSecondary),
      spayedNeutered: dog.spayedNeutered,
      houseTrained: dog.houseTrained,
      shotsCurrent: dog.shotsCurrent,
      specialNeeds: dog.specialNeeds,
      goodWithChildren: nullToUndefined(dog.goodWithChildren),
      goodWithDogs: nullToUndefined(dog.goodWithDogs),
      goodWithCats: nullToUndefined(dog.goodWithCats),
      contactEmail: nullToUndefined(dog.contactEmail),
      contactPhone: nullToUndefined(dog.contactPhone)
    };
  };

  const fillFormField = async (page: Page, field: FormField): Promise<void> => {
    const element = await page.$(field.selector);
    if (!element && field.required) {
      throw new Error(`Required form field not found: ${field.selector}`);
    }
    if (!element) return; // Skip optional fields that don't exist

    const tagName = await element.evaluate((el): string => el.tagName.toLowerCase());
    
    switch (tagName) {
      case 'input': {
        const inputType = await element.evaluate((el): string => 
          (el as HTMLInputElement).type.toLowerCase()
        );
        
        if (inputType === 'checkbox') {
          if (typeof field.value === 'boolean' && field.value) {
            await element.click();
          }
        } else {
          if (typeof field.value === 'string') {
            await element.type(field.value);
          }
        }
        break;
      }
      case 'select': {
        if (typeof field.value === 'string') {
          await page.select(field.selector, field.value);
        }
        break;
      }
      case 'textarea': {
        if (typeof field.value === 'string') {
          await element.type(field.value);
        }
        break;
      }
    }
  };

  const fillPetForm = async (page: Page, dog: Dog): Promise<void> => {
    console.log(`Filling form for ${dog.name}...`);
    
    const formData = convertDogToFormData(dog);
    
    const formFields: readonly FormField[] = [
      { selector: 'input[name="name"]', value: formData.name, required: true },
      { selector: 'select[name="animal_type"]', value: formData.animalType },
      { selector: 'input[name="breed_primary"]', value: formData.breedPrimary, required: true },
      { selector: 'input[name="breed_secondary"]', value: formData.breedSecondary ?? '' },
      { selector: 'select[name="gender"]', value: formData.gender },
      { selector: 'select[name="size"]', value: formData.size },
      { selector: 'select[name="age"]', value: formData.age },
      { selector: 'textarea[name="description"]', value: formData.description ?? '' },
      { selector: 'input[name="color_primary"]', value: formData.colorPrimary ?? '' },
      { selector: 'input[name="color_secondary"]', value: formData.colorSecondary ?? '' },
      { selector: 'input[name="spayed_neutered"]', value: formData.spayedNeutered },
      { selector: 'input[name="house_trained"]', value: formData.houseTrained },
      { selector: 'input[name="shots_current"]', value: formData.shotsCurrent },
      { selector: 'input[name="special_needs"]', value: formData.specialNeeds },
      { selector: 'input[name="good_with_kids"]', value: formData.goodWithChildren === true },
      { selector: 'input[name="good_with_dogs"]', value: formData.goodWithDogs === true },
      { selector: 'input[name="good_with_cats"]', value: formData.goodWithCats === true },
      { selector: 'input[name="contact_email"]', value: formData.contactEmail ?? '' },
      { selector: 'input[name="contact_phone"]', value: formData.contactPhone ?? '' }
    ] as const;

    // Wait for required name field to ensure form is loaded
    await page.waitForSelector('input[name="name"]', { timeout: defaultTimeout });

    // Fill all form fields
    for (const field of formFields) {
      try {
        await fillFormField(page, field);
      } catch (error) {
        console.warn(`Failed to fill field ${field.selector}:`, error);
        if (field.required) {
          throw error;
        }
      }
    }
  };

  const submitForm = async (page: Page): Promise<string> => {
    console.log('Submitting form...');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: defaultTimeout }),
      page.click('button[type="submit"], input[type="submit"]')
    ]);
    
    // Get the new pet ID from the success page or URL
    const currentUrl = page.url();
    const petIdMatch = currentUrl.match(/pet[\/\-](\d+)/i);
    
    if (petIdMatch?.[1]) {
      return petIdMatch[1];
    }
    
    // Alternative: look for pet ID in page content
    const petIdElement = await page.$('[data-pet-id], .pet-id');
    if (petIdElement) {
      const petId = await page.evaluate((el): string | null => 
        el.textContent ?? el.getAttribute('data-pet-id')
      , petIdElement);
      
      if (petId) {
        return petId;
      }
    }
    
    throw new Error('Could not determine pet ID after submission');
  };

  return {
    uploadDog: async (dog: Dog): Promise<string> => {
      const browserInstance = await init();
      const page = await browserInstance.newPage();
      
      try {
        await login(page);
        await navigateToAddPet(page);
        await fillPetForm(page, dog);
        const petfinderId = await submitForm(page);
        
        console.log(`Successfully uploaded ${dog.name} with Petfinder ID: ${petfinderId}`);
        return petfinderId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to upload ${dog.name}:`, errorMessage);
        throw new Error(`Failed to upload ${dog.name}: ${errorMessage}`);
      } finally {
        await page.close();
      }
    },

    testConnection: async (): Promise<boolean> => {
      const browserInstance = await init();
      const page = await browserInstance.newPage();
      
      try {
        await login(page);
        return true;
      } catch (error) {
        console.error('Scraper connection test failed:', error);
        return false;
      } finally {
        await page.close();
      }
    },

    close: async (): Promise<void> => {
      if (browser) {
        await browser.close();
        browser = null;
      }
    }
  };
};