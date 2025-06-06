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
  readonly breedMixed: boolean;
  readonly breedUnknown: boolean;
  readonly gender: 'Male' | 'Female' | 'Unknown';
  readonly size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  readonly age: 'Baby' | 'Young' | 'Adult' | 'Senior';
  readonly coat?: string;
  readonly description?: string;
  readonly colorPrimary?: string;
  readonly colorSecondary?: string;
  readonly colorTertiary?: string;
  readonly spayedNeutered: boolean;
  readonly houseTrained: boolean;
  readonly shotsCurrent: boolean;
  readonly specialNeeds: boolean;
  readonly goodWithChildren?: boolean;
  readonly goodWithDogs?: boolean;
  readonly goodWithCats?: boolean;
  readonly contactEmail?: string;
  readonly contactPhone?: string;
  readonly tags?: string[];
}

export const createPetfinderScraper = (config: PetfinderScraperConfig): PetfinderScraperService => {
  let browser: Browser | null = null;
  const defaultTimeout = config.timeout ?? 30000; // Increased timeout

  const init = async (): Promise<Browser> => {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: config.headless ?? true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-default-apps'
        ]
      });
    }
    return browser;
  };

  const login = async (page: Page): Promise<void> => {
    console.log('Logging into Petfinder organization dashboard...');
    
    // Navigate to organization login page
    await page.goto('https://www.petfinder.com/member/login/', { 
      waitUntil: 'networkidle2',
      timeout: defaultTimeout 
    });
    
    try {
      // Wait for login form elements
      await page.waitForSelector('#login-username, input[name="username"], input[type="email"]', { 
        timeout: defaultTimeout 
      });
      
      // Try different selectors for username field
      const usernameSelector = await page.$('#login-username') || 
                              await page.$('input[name="username"]') || 
                              await page.$('input[type="email"]');
      
      if (!usernameSelector) {
        throw new Error('Could not find username input field');
      }
      
      await usernameSelector.type(config.username);
      
      // Find and fill password field
      const passwordSelector = await page.$('#login-password') || 
                              await page.$('input[name="password"]') || 
                              await page.$('input[type="password"]');
      
      if (!passwordSelector) {
        throw new Error('Could not find password input field');
      }
      
      await passwordSelector.type(config.password);
      
      // Submit the form
      const submitButton = await page.$('#login-submit') || 
                          await page.$('button[type="submit"]') || 
                          await page.$('input[type="submit"]') ||
                          await page.$('.submit-button');
      
      if (!submitButton) {
        throw new Error('Could not find submit button');
      }
      
      // Click submit and wait for navigation
      await Promise.all([
        page.waitForNavigation({ 
          waitUntil: 'networkidle2', 
          timeout: defaultTimeout 
        }),
        submitButton.click()
      ]);
      
      // Check if login was successful by looking for dashboard elements
      const currentUrl = page.url();
      if (currentUrl.includes('login') || currentUrl.includes('error')) {
        // Check for error messages
        const errorElement = await page.$('.error-message, .alert-danger, .login-error');
        if (errorElement) {
          const errorText = await page.evaluate(el => el.textContent, errorElement);
          throw new Error(`Login failed: ${errorText}`);
        }
        throw new Error('Login failed - still on login page');
      }
      
      console.log('Successfully logged into Petfinder');
      
    } catch (error) {
      console.error('Login error details:', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const navigateToAddPet = async (page: Page): Promise<void> => {
    console.log('Navigating to Add Pet page...');
    
    try {
      // Navigate to pet management section
      await page.goto('https://www.petfinder.com/member/pet-management/', { 
        waitUntil: 'networkidle2',
        timeout: defaultTimeout 
      });
      
      // Look for "Add Pet" button or link
      const addPetButton = await page.$('a[href*="add-pet"], button[text*="Add"], .add-pet-button') ||
                          await page.$('a:contains("Add Pet"), a:contains("Add Animal")');
      
      if (addPetButton) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: defaultTimeout }),
          addPetButton.click()
        ]);
      } else {
        // Direct navigation to add pet page
        await page.goto('https://www.petfinder.com/member/pet-management/add-pet/', { 
          waitUntil: 'networkidle2',
          timeout: defaultTimeout 
        });
      }
      
      // Wait for the form to load
      await page.waitForSelector('form, #pet-form, .pet-form', { timeout: defaultTimeout });
      
    } catch (error) {
      console.error('Navigation error:', error);
      throw new Error(`Failed to navigate to Add Pet page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const convertDogToFormData = (dog: Dog): PetfinderFormData => {
    const getGender = (gender: string): PetfinderFormData['gender'] => {
      const genderMap: Record<string, PetfinderFormData['gender']> = {
        'MALE': 'Male',
        'FEMALE': 'Female',
        'UNKNOWN': 'Unknown'
      };
      return genderMap[gender] ?? 'Unknown';
    };

    const getSize = (size: string): PetfinderFormData['size'] => {
      const sizeMap: Record<string, PetfinderFormData['size']> = {
        'SMALL': 'Small',
        'MEDIUM': 'Medium',
        'LARGE': 'Large',
        'XLARGE': 'Extra Large'
      };
      return sizeMap[size] ?? 'Medium';
    };

    const getAge = (age: number): PetfinderFormData['age'] => {
      if (age < 1) return 'Baby';
      if (age < 3) return 'Young';
      if (age < 8) return 'Adult';
      return 'Senior';
    };

    const getCoat = (coat?: string): string => {
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
      name: dog.name,
      animalType: 'Dog',
      breedPrimary: dog.breed,
      breedSecondary: dog.breedSecondary ?? undefined,
      breedMixed: dog.breedMixed,
      breedUnknown: dog.breedUnknown,
      gender: getGender(dog.gender),
      size: getSize(dog.size),
      age: getAge(dog.age),
      coat: getCoat(dog.coat || ''),
      description: dog.description ?? undefined,
      colorPrimary: dog.colorPrimary ?? undefined,
      colorSecondary: dog.colorSecondary ?? undefined,
      colorTertiary: dog.colorTertiary ?? undefined,
      spayedNeutered: dog.spayedNeutered,
      houseTrained: dog.houseTrained,
      shotsCurrent: dog.shotsCurrent,
      specialNeeds: dog.specialNeeds,
      goodWithChildren: dog.goodWithChildren ?? undefined,
      goodWithDogs: dog.goodWithDogs ?? undefined,
      goodWithCats: dog.goodWithCats ?? undefined,
      contactEmail: dog.contactEmail ?? undefined,
      contactPhone: dog.contactPhone ?? undefined,
      tags: dog.tags.length > 0 ? dog.tags : undefined
    };
  };

  const fillPetForm = async (page: Page, dog: Dog): Promise<void> => {
    console.log(`Filling form for ${dog.name}...`);
    
    const formData = convertDogToFormData(dog);
    
    try {
      // Wait for the form to be ready
      await page.waitForSelector('input, select, textarea', { timeout: defaultTimeout });
      
      // Fill basic information
      await fillFieldIfExists(page, ['#pet-name', 'input[name="name"]', 'input[placeholder*="name"]'], formData.name);
      
      // Select animal type (Dog)
      await selectFieldIfExists(page, ['select[name="type"]', '#animal-type'], 'Dog');
      
      // Fill breed information
      await fillFieldIfExists(page, ['input[name="breed"]', '#breed-primary'], formData.breedPrimary);
      if (formData.breedSecondary) {
        await fillFieldIfExists(page, ['input[name="breed2"]', '#breed-secondary'], formData.breedSecondary);
      }
      
      // Handle breed checkboxes
      if (formData.breedMixed) {
        await checkFieldIfExists(page, ['input[name="mixed"]', '#mixed-breed'], true);
      }
      if (formData.breedUnknown) {
        await checkFieldIfExists(page, ['input[name="unknown"]', '#unknown-breed'], true);
      }
      
      // Fill physical characteristics
      await selectFieldIfExists(page, ['select[name="gender"]', '#gender'], formData.gender);
      await selectFieldIfExists(page, ['select[name="size"]', '#size'], formData.size);
      await selectFieldIfExists(page, ['select[name="age"]', '#age'], formData.age);
      
      if (formData.coat) {
        await selectFieldIfExists(page, ['select[name="coat"]', '#coat'], formData.coat);
      }
      
      // Fill colors
      if (formData.colorPrimary) {
        await fillFieldIfExists(page, ['input[name="color1"]', '#color-primary'], formData.colorPrimary);
      }
      if (formData.colorSecondary) {
        await fillFieldIfExists(page, ['input[name="color2"]', '#color-secondary'], formData.colorSecondary);
      }
      
      // Fill description
      if (formData.description) {
        await fillFieldIfExists(page, ['textarea[name="description"]', '#description'], formData.description);
      }
      
      // Handle attributes (checkboxes)
      await checkFieldIfExists(page, ['input[name="spayed_neutered"]', '#spayed-neutered'], formData.spayedNeutered);
      await checkFieldIfExists(page, ['input[name="house_trained"]', '#house-trained'], formData.houseTrained);
      await checkFieldIfExists(page, ['input[name="shots_current"]', '#shots-current'], formData.shotsCurrent);
      await checkFieldIfExists(page, ['input[name="special_needs"]', '#special-needs'], formData.specialNeeds);
      
      // Handle environment (tri-state)
      if (formData.goodWithChildren !== undefined) {
        await selectTriState(page, 'children', formData.goodWithChildren);
      }
      if (formData.goodWithDogs !== undefined) {
        await selectTriState(page, 'dogs', formData.goodWithDogs);
      }
      if (formData.goodWithCats !== undefined) {
        await selectTriState(page, 'cats', formData.goodWithCats);
      }
      
      // Fill contact information
      if (formData.contactEmail) {
        await fillFieldIfExists(page, ['input[name="email"]', '#contact-email'], formData.contactEmail);
      }
      if (formData.contactPhone) {
        await fillFieldIfExists(page, ['input[name="phone"]', '#contact-phone'], formData.contactPhone);
      }
      
      // Add tags if supported
      if (formData.tags && formData.tags.length > 0) {
        const tagsString = formData.tags.join(', ');
        await fillFieldIfExists(page, ['input[name="tags"]', '#tags', 'textarea[name="tags"]'], tagsString);
      }
      
    } catch (error) {
      console.error('Form filling error:', error);
      throw new Error(`Failed to fill form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper functions for form interaction
  const fillFieldIfExists = async (page: Page, selectors: string[], value: string): Promise<void> => {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        await element.click({ clickCount: 3 }); // Select all text
        await element.type(value);
        return;
      }
    }
  };

  const selectFieldIfExists = async (page: Page, selectors: string[], value: string): Promise<void> => {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        await page.select(selector, value);
        return;
      }
    }
  };

  const checkFieldIfExists = async (page: Page, selectors: string[], checked: boolean): Promise<void> => {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        const isChecked = await page.evaluate((el) => (el as HTMLInputElement).checked, element);
        if (isChecked !== checked) {
          await element.click();
        }
        return;
      }
    }
  };

  const selectTriState = async (page: Page, fieldType: string, value: boolean): Promise<void> => {
    const radioValue = value ? 'yes' : 'no';
    const selectors = [
      `input[name="good_with_${fieldType}"][value="${radioValue}"]`,
      `input[name="${fieldType}"][value="${radioValue}"]`,
      `#${fieldType}-${radioValue}`
    ];
    
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        await element.click();
        return;
      }
    }
  };

  const submitForm = async (page: Page): Promise<string> => {
    console.log('Submitting form...');
    
    try {
      // Look for submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        '#submit-pet',
        '.submit-button',
        'button:contains("Save")',
        'button:contains("Submit")',
        'button:contains("Add Pet")'
      ];
      
      let submitButton = null;
      for (const selector of submitSelectors) {
        submitButton = await page.$(selector);
        if (submitButton) break;
      }
      
      if (!submitButton) {
        throw new Error('Could not find submit button');
      }
      
      // Submit the form
      await Promise.all([
        page.waitForNavigation({ 
          waitUntil: 'networkidle2', 
          timeout: defaultTimeout 
        }),
        submitButton.click()
      ]);
      
      // Try to extract pet ID from the success page
      const currentUrl = page.url();
      console.log('Post-submit URL:', currentUrl);
      
      // Look for pet ID in URL
      const petIdMatch = currentUrl.match(/pet[\/\-](\d+)|animal[\/\-](\d+)|id[=\/](\d+)/i);
      if (petIdMatch) {
        const petId = petIdMatch[1] || petIdMatch[2] || petIdMatch[3];
        if (petId) {
          return petId;
        }
      }
      
      // Look for pet ID in page content
      await new Promise(resolve => setTimeout(resolve, 2000)); // Give page time to load
      
      const petIdSelectors = [
        '[data-pet-id]',
        '.pet-id',
        '#pet-id',
        '.animal-id',
        '#animal-id'
      ];
      
      for (const selector of petIdSelectors) {
        const element = await page.$(selector);
        if (element) {
          const petId = await page.evaluate((el) => 
            el.textContent?.trim() || el.getAttribute('data-pet-id')
          , element);
          if (petId && /^\d+$/.test(petId)) {
            return petId;
          }
        }
      }
      
      // If no specific ID found, generate a temporary one
      const timestamp = Date.now().toString();
      console.log('Could not determine specific pet ID, using timestamp:', timestamp);
      return timestamp;
      
    } catch (error) {
      console.error('Form submission error:', error);
      throw new Error(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    uploadDog: async (dog: Dog): Promise<string> => {
      const browserInstance = await init();
      const page = await browserInstance.newPage();
      
      try {
        // Set viewport for better compatibility
        await page.setViewport({ width: 1280, height: 720 });
        
        await login(page);
        await navigateToAddPet(page);
        await fillPetForm(page, dog);
        const petfinderId = await submitForm(page);
        
        console.log(`Successfully uploaded ${dog.name} with Petfinder ID: ${petfinderId}`);
        return petfinderId;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to upload ${dog.name}:`, errorMessage);
        
        // Take screenshot for debugging if possible
        try {
          await page.screenshot({ 
            path: `debug-screenshot-${Date.now()}.png`,
            fullPage: true 
          });
        } catch (screenshotError) {
          console.error('Could not take debug screenshot:', screenshotError);
        }
        
        throw new Error(`Failed to upload ${dog.name}: ${errorMessage}`);
      } finally {
        await page.close();
      }
    },

    testConnection: async (): Promise<boolean> => {
      const browserInstance = await init();
      const page = await browserInstance.newPage();
      
      try {
        await page.setViewport({ width: 1280, height: 720 });
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