export interface PetfinderAuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
  }
  
  export interface PetfinderAnimal {
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
  }