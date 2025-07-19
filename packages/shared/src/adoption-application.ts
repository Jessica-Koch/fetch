export interface AdoptionApplicationSubmission {
  // Selected dogs
  selectedDogs: string[];

  // Adopter info (will be saved to PostgreSQL)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneType: 'MOBILE' | 'HOME' | 'WORK';
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  socialMedia?: string;
  adopterAge: string;
  occupation: string;
  employer: string;
  lengthOfEmployment: string;

  // All form fields for MongoDB
  dogName: string;
  isGift: 'yes' | 'no';
  dogExperience: string;
  breedExperience: string;
  significantOther: boolean;
  partnerName?: string;
  partnerOccupation?: string;
  householdMembers: string;
  dogAllergies: string;
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
  numberOfPets: string;
  pets?: Array<{
    name: string;
    species: string;
    age: string;
    sex: string;
    spayedOrNeutered: boolean;
    breed: string;
  }>;
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
  petTakenToShelter: string;
  everGaveUpPet: string;
  giveUpPet: string;
  euthanizeDog: string;
  moveWithoutDog: string;
  trainingExperience: string;
  familiarWithCutOffCues: 'veryFamiliar' | 'somewhatFamiliar' | 'notFamiliar';
  trainingPlans: string[];
  difficultBehaviors: string;
  dogSocialization: string;
  petIntroduction?: string;
  destructiveBehavior: 'yes' | 'no';
  costOfDog: 'yes' | 'no';
  dogHousebreaking: 'yes' | 'no';
  willingToTrain: 'yes' | 'no' | 'depends';
  dateReadyToAdopt: string;
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
  photoUrls?: string[]; // URLs after uploading to S3/storage
}

export interface AdoptionApplicationResponse {
  _id: string;
  adopterId: string;
  dogIds: string[];
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}
