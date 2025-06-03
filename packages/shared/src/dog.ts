export enum DogStatus {
    AVAILABLE = 'AVAILABLE',
    PENDING = 'PENDING',
    ADOPTED = 'ADOPTED',
    HOLD = 'HOLD',
    MEDICAL = 'MEDICAL'
  }
  
  export enum Placement {
    IN_FOSTER = 'IN_FOSTER',
    BOARDING = 'BOARDING',
    FOSTER_TO_ADOPT = 'FOSTER_TO_ADOPT'
  }
  
  export interface Dog {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight?: number;
    description?: string;
    status: DogStatus;
    placement: Placement;
    photos: string[];
    petfinderId?: string;
    postedToPetfinder: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateDogRequest {
    name: string;
    breed: string;
    age: number;
    weight?: number;
    description?: string;
    photos?: string[];
  }
  
  export interface UpdateDogRequest {
    name?: string;
    breed?: string;
    age?: number;
    weight?: number;
    description?: string;
    status?: DogStatus;
    placement?: Placement;
    photos?: string[];
  }