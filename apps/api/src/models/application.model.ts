import { ObjectId } from 'mongodb';

export interface PetInfo {
  name: string;
  species: string;
  age: string;
  sex: string;
  spayedOrNeutered: boolean;
  breed: string;
}

export interface AdoptionApplication {
  _id?: ObjectId;

  // Adopter Reference (PostgreSQL ID)
  adopterId: string;

  // Dog References (PostgreSQL IDs)
  dogIds: string[];

  // Application Status
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

  // Form Data (all the complex form fields)
  dogInfo: {
    dogName: string;
    isGift: 'yes' | 'no';
    dogExperience: string;
    breedExperience: string;
  };

  householdInfo: {
    significantOther: boolean;
    partnerName?: string;
    partnerOccupation?: string;
    householdMembers: string;
    dogAllergies: string;
  };

  housingInfo: {
    ownsOrRents: 'own' | 'rent' | 'other';
    housingOtherExplain?: string;
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    allowsDogs?: 'yes' | 'no';
    breedRestrictions?: 'yes' | 'no';
    hoa?: 'yes' | 'no';
    hoaBreedRestrictions?: 'yes' | 'no';
    houseType: 'house' | 'townhome' | 'apartment' | 'mobile_home' | 'other';
    hasFence: boolean;
    fenceType?: string;
  };

  currentPets: {
    numberOfPets: number;
    pets: PetInfo[];
  };

  lifestyleCare: {
    vetName: string;
    motivation: string;
    petEnergyLevel: 'low' | 'medium' | 'high';
    dogFood: string;
    howActiveIsYourHousehold: 'low' | 'light' | 'moderate' | 'high';
    dailyExerciseAndEnrichment: string;
    offLimitsPlaces: string;
    hoursAlone: string;
    whereDogWillBeWhenAlone: string[];
    travelPlans: string;
    openToOtherDogs: 'yes' | 'no' | 'notApplicable';
  };

  additionalQuestions: {
    petTakenToShelter: string;
    everGaveUpPet: string;
    giveUpPet: string;
    euthanizeDog: string;
    moveWithoutDog: string;
  };

  trainingBehavior: {
    trainingExperience: string;
    familiarWithCutOffCues: 'veryFamiliar' | 'somewhatFamiliar' | 'notFamiliar';
    trainingPlans: string[];
    difficultBehaviors: string;
    dogSocialization: string;
    petIntroduction?: string;
  };

  // Media files stored as GridFS references or S3 URLs
  photos: string[];

  finalAgreements: {
    destructiveBehavior: 'yes' | 'no';
    costOfDog: 'yes' | 'no';
    dogHousebreaking: 'yes' | 'no';
    willingToTrain: 'yes' | 'no' | 'depends';
    dateReadyToAdopt: Date;
    howDidYouHearAboutUs:
      | 'petfinder'
      | 'facebook'
      | 'instagram'
      | 'google'
      | 'friendOrFamily'
      | 'adoptionEvent'
      | 'other';
    additionalQuestionsAndInfo?: string;
    longTermCommitment: 'yes' | 'no';
    unknownHistory: 'yes' | 'no';
    ageRequirement: 'yes' | 'no';
    termsAndConditions: 'yes' | 'no';
    signature: 'yes' | 'no';
  };

  // Metadata
  submittedAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;

  // Communication
  internalNotes?: string[];
  emailsSent?: {
    type: string;
    sentAt: Date;
    subject: string;
  }[];
}
