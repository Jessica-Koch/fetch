export type FieldType =
  | 'checkbox'
  | 'checkboxGroup'
  | 'date'
  | 'email'
  | 'fieldset'
  | 'file'
  | 'number'
  | 'password'
  | 'radio'
  | 'section'
  | 'select'
  | 'tel'
  | 'text'
  | 'textarea';

export interface AdoptionFieldConfig<T = FieldState> {
  name: string;
  label: string | ((idx: number) => string);
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  condition?: (formState: T) => boolean;
  placeholder?: string;
  helperText?: string;
  min?: number;
  max?: number;
  repeat?: (formState: T) => number;
  groupId?: string;
  accept?: string[];
  minFiles?: number;
  maxFiles?: number;
}

export const adoptionFields: AdoptionFormSection<FieldState>[] = [
  {
    id: 'dog_info',
    title: 'Dog Information',
    fields: [
      {
        name: 'dogName',
        label: 'What is the name of the dog you wish to adopt?',
        type: 'text',
        required: true,
      },
      {
        name: 'isGift',
        label: 'Is this dog a gift?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'dogExperience',
        label: 'Do you have experience owning a dog?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'breedExperience',
        label: 'What experience do you have with this breed?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'applicant_info',
    title: 'Adopter Information',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true },
      {
        name: 'phoneType',
        label: 'Phone Type',
        type: 'select',
        required: true,
        options: [
          { value: 'mobile', label: 'Mobile' },
          { value: 'home', label: 'Home' },
          { value: 'work', label: 'Work' },
        ],
        groupId: 'primaryPhone',
      },
      { name: 'address1', label: 'Address 1', type: 'text', required: true },
      { name: 'address2', label: 'Address 2', type: 'text' },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'zip', label: 'Zip Code', type: 'text', required: true },
      { name: 'zipCode', label: 'Zipcode', type: 'text', required: true }, // If this is a dupe, you can drop one.
      {
        name: 'socialMedia',
        label: 'Link to your social media profile (Instagram, Facebook, etc.) ',
        type: 'text',
        required: true,
      },
      {
        name: 'adopterAge',
        label: 'What is your age?',
        type: 'text',
        required: true,
      },
      {
        name: 'occupation',
        label: 'What is your occupation?',
        required: true,
        type: 'text',
      },
      {
        name: 'employer',
        label: 'Who is your employer?',
        required: true,
        type: 'text',
      },
      {
        name: 'lengthOfEmployment',
        label: 'How long have you been employed with your employer?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'household_info',
    title: 'Household Information',
    fields: [
      {
        name: 'significantOther',
        label:
          'Do you have a significant other or will someone else be adopting with you?',
        type: 'checkbox',
        required: true,
      },
      {
        name: 'partnerName',
        label: "Partner's Full Name",
        type: 'text',
        condition: (form: AdoptionFormState) => form.significantOther?.value,
        required: true,
      },
      {
        name: 'partnerOccupation',
        label: "What is your partner's occupation?",
        type: 'text',

        condition: (form: AdoptionFormState) => !!form.significantOther,
      },
      {
        name: 'householdMembers',
        required: true,
        label:
          'Describe the other people living in your home including ages, genders and their relationship to you.',
        type: 'textarea',
      },
      {
        name: 'dogAllergies',
        required: true,
        label:
          'Are any members of your household allergic to pets, if so, what is the nature of their allergy?',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'housing_info',
    title: 'Housing Information',
    fields: [
      {
        name: 'ownsOrRents',
        label: 'Do you own or rent your home?',
        type: 'radio',
        required: true,
        options: [
          { value: 'own', label: 'Own' },
          { value: 'rent', label: 'Rent' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'housingOtherExplain',
        label: 'Please explain:',
        type: 'text',
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'other',
      },
      {
        name: 'landlordName',
        label: 'Landlord Name',
        type: 'text',
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'rent',
      },
      {
        name: 'landlordPhone',
        label: 'Landlord Phone',
        type: 'tel',
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'rent',
      },
      {
        name: 'landlordEmail',
        label: 'Landlord Email',
        type: 'email',
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'rent',
      },

      {
        name: 'allowsDogs',
        label: 'Does your landlord allow dogs?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'rent',
      },
      {
        name: 'breedRestrictions',
        label: 'Are there breed restrictions?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'rent' &&
          form.allowsDogs?.value === 'yes',
      },

      {
        name: 'hoa',
        label: 'Are you part of an HOA?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'own',
      },
      {
        name: 'hoaBreedRestrictions',
        label: 'Are there breed restrictions?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        condition: (form: AdoptionFormState) =>
          form.ownsOrRents?.value === 'own' && form.hoa?.value === 'yes',
      },
      {
        name: 'houseType',
        label: 'Which best describes your home?',
        type: 'radio',
        options: [
          { value: 'house', label: 'House' },
          { value: 'townhome', label: 'Townhome' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'mobile_home', label: 'Mobile Home' },
          { value: 'other', label: 'Other' },
        ],
        required: true,
      },

      {
        name: 'hasFence',
        required: true,
        label: 'Is your yard fenced in?',
        type: 'checkbox',
      },
      {
        name: 'fenceType',
        label:
          'What type of fence do you have and what is its height at its lowest point?',
        type: 'text',
        required: true,
        condition: (form: AdoptionFormState) => form.hasFence?.value,
      },
    ],
  },
  {
    id: 'current_pets',
    title: 'Current Pets',
    fields: [
      {
        name: 'numberOfPets',
        required: true,
        label: 'How many other pets do you have?',
        type: 'number',
        min: 0,
        max: 10,
      },
      {
        name: 'petName',
        label: (idx: number) => `Pet ${idx + 1} Name`,
        type: 'text',
        required: true,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
      {
        name: 'petSpecies',
        label: (idx: number) => `Pet ${idx + 1} Species`,
        type: 'text',
        required: true,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
      {
        name: 'petSex',
        label: (idx: number) => `Pet ${idx + 1} Sex`,
        type: 'text',
        required: true,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
      {
        name: 'petAge',
        label: (idx: number) => `Pet ${idx + 1} Age`,
        type: 'text',
        required: true,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
      {
        name: 'spayedOrNeutered',
        label: (idx: number) => `Pet ${idx + 1} Spayed/Neutered (Y/N)`,
        type: 'text',
        required: true,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
      {
        name: 'petBreed',
        label: (idx: number) => `Pet ${idx + 1} Breed`,
        type: 'text',
        required: false,
        repeat: (form: AdoptionFormState) =>
          Math.max(0, Math.min(Number(form.numberOfPets?.value) || 0, 10)),
      },
    ],
  },
  {
    id: 'lifestyle_and_care',
    title: 'Lifestyle & Care',
    fields: [
      {
        name: 'vetName',
        required: true,
        label: "What is your veterinarian's name?",
        type: 'text',
      },

      {
        name: 'motivation',
        label:
          'What’s your motivation to get a dog at this point in your life?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'petEnergyLevel',
        label: 'What energy level are you looking for in a dog?',
        type: 'radio',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      },
      {
        name: 'dogFood',
        label:
          "What will the dog's diet consist of? (please include brand names, etc)",
        type: 'textarea',
        required: true,
      },

      {
        name: 'howActiveIsYourHousehold',
        label: 'How active is your lifestyle?',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'low',
            label:
              'Mostly home and relaxed - Prefer calm days at home, little or no daily walks.',
          },
          {
            value: 'light',
            label:
              'Lightly active - Enjoy some playtime and short walks, but also appreciate downtime.',
          },
          {
            value: 'moderate',
            label:
              'Moderately active - Regular walks, playtime, and some outdoor activities.',
          },
          {
            value: 'high',
            label:
              'Very active - Frequent hiking, running, or high-energy adventures',
          },
        ],
      },
      {
        name: 'dailyExerciseAndEnrichment',
        label:
          'Please describe both your daily physical exercise and mental enrichment plans for your dogs.',
        helperText:
          'Physical exercise includes walks, runs, playtime, etc. Mental enrichment includes training, puzzle toys, etc.',
        type: 'textarea',
        required: true,
      },
      {
        name: 'offLimitsPlaces',
        required: true,
        label: 'Will any place be off-limits for the dog when you are home?',
        type: 'textarea',
        placeholder: 'Furniture, bedrooms, kitchen, etc.',
      },
      {
        name: 'hoursAlone',
        label: 'How many hours per day will the dog spend alone?',
        type: 'text',
        required: true,
      },
      {
        name: 'whereDogWillBeWhenAlone',
        label: "Where will the dog stay when you're not home?",
        helperText: 'Please select all that apply.',
        type: 'checkboxGroup',
        required: true,
        options: [
          { value: 'freeRoaming', label: 'Free Roaming' },
          { value: 'cratedIndoors', label: 'Crated Indoors' },
          { value: 'confinedToRoom', label: 'Confined to Room' },
          { value: 'inYard', label: 'In Yard' },
          { value: 'outdoorKennel', label: 'Outdoor Kennel' },
          { value: 'withFriendsOrFamily', label: 'With Friends or Family' },
          { value: 'doggieDaycare', label: 'Doggie Daycare' },
          { value: 'rover', label: 'Rover or Other Sitter Services' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'travelPlans',
        required: true,
        label:
          'How often do you travel? How will you care for your dog when you are away from home? ',
        type: 'textarea',
      },

      {
        name: 'openToOtherDogs',
        label:
          'If the specific dog you have applied for is not available, can we match you with other, available, dogs?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          {
            value: 'notApplicable',
            label: "I didn't apply for a specific dog",
          },
        ],
      },
    ],
  },
  {
    id: 'additional_questions',
    title: 'Additional Questions',
    fields: [
      {
        name: 'petTakenToShelter',
        label:
          'Have you ever taken your personal dog to animal control, the humane society, or a shelter before? If so, why?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'everGaveUpPet',
        label:
          'Have you ever had to give up a pet? If so, what were the circumstances?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'giveUpPet',
        label:
          'Under what circumstances would you consider giving up this dog?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'euthanizeDog',

        label: 'What reason would lead you to euthanize your dog?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'moveWithoutDog',
        label:
          'What will you do if you move somewhere where dogs are not welcome?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'training_and_behavior',
    title: 'Training & Behavior',
    fields: [
      {
        name: 'trainingExperience',
        required: true,
        label:
          'Have you ever used a pet behavior/trainer in the past? If so, please describe your experience, what was the issue, and how it was resolved.',
        type: 'textarea',
        placeholder: 'e.g. barking, chewing, jumping, etc.',
      },
      {
        name: 'familiarWithCutOffCues',
        label:
          "How familiar are you with reading dogs' body language and cut off cues?",
        type: 'radio',
        required: true,
        options: [
          { value: 'veryFamiliar', label: 'Very familiar' },
          { value: 'somewhatFamiliar', label: 'Somewhat familiar' },
          { value: 'notFamiliar', label: 'Not familiar' },
        ],
      },
      {
        name: 'trainingPlans',
        label: 'How will you train this dog?',
        helperText: 'Select all that apply.',
        type: 'checkboxGroup',
        required: true,
        options: [
          { value: 'positiveReinforcement', label: 'Positive Reinforcement' },
          { value: 'clickerTraining', label: 'Clicker Training' },
          { value: 'obedienceClasses', label: 'Obedience Classes' },
          { value: 'privateTraining', label: 'Private Training' },
          { value: 'selfTaught', label: 'Self-Taught' },
          { value: 'tap on the nose', label: 'Tap on the Nose' },
          { value: 'prongCollar', label: 'Prong Collar' },
          { value: 'shockCollar', label: 'Shock Collar' },
          { value: 'youtubeVideos', label: 'YouTube Videos' },
          { value: 'spanking', label: 'Spanking' },
          { value: 'hit withNewspaper', label: 'Hit with Newspaper' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'difficultBehaviors',
        label:
          'Are there any behaviors in a dog that you would find difficult to tolerate or manage?',
        helperText:
          'Examples might include barking, chewing, jumping, fearfulness, reactivity, or house training issues.',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. barking, chewing, jumping, etc.',
      },
      {
        name: 'dogSocialization',
        label:
          'Where & how will your dog or puppy receive socialization with other dogs?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'petIntroduction',
        condition: (form: AdoptionFormState) => form.numberOfPets?.value > 0,
        label:
          'How do you plan on introducing/acclimating your current pets to your newly adopted pet?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'photos',
    title: 'Photos',
    fields: [
      {
        name: 'photos',
        label:
          'Upload at least 5 photos or videos (showing indoor & outdoor spaces)',
        type: 'file',
        required: true,
        accept: ['image/*', 'video/*'],
        minFiles: 5,
        maxFiles: 12,
        helperText:
          'Please upload clear photos or videos of your home, including both indoor and outdoor spaces. Minimum of 5 required.',
      },
    ],
  },
  {
    id: 'final_agreements',
    title: 'Final Agreements & Disclosures',
    fields: [
      {
        name: 'destructiveBehavior',
        label:
          'Do you understand this dog may be destructive while learning, if not properly confined? Furniture, carpet, doors and personal items may be destroyed.',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'costOfDog',
        label:
          'I understand that the average cost of owning a healthy dog is a minimum $1000 per year which include vetting, feeding, grooming, flea/tick treatments, dental care, and other miscellaneous costs (not counting vet emergencies). As the dog ages, I understand that these costs can significantly increase. I am prepared to make the financial and time commitment to my future dog for the duration of its life.',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'dogHousebreaking',
        label:
          'Do you understand that this dog may need patience and consistent training to learn housebreaking and how to behave inside a home (barking, chewing, jumping, etc)',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'willingToTrain',
        label:
          'Are you willing and prepared financially to hire a behaviorist trainer if needed?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'depends', label: 'It Depends' },
        ],
      },

      {
        name: 'dateReadyToAdopt',
        label: 'What date are you ready to bring a new dog home?',
        type: 'date',
        required: true,
      },
      {
        name: 'howDidYouHearAboutUs',
        label: 'How did you hear about us?',
        type: 'radio',
        required: true,
        options: [
          { value: 'petfinder', label: 'Petfinder' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'google', label: 'Google' },
          { value: 'friendOrFamily', label: 'Friend or Family' },
          { value: 'adoptionEvent', label: 'Adoption Event' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'additionalQuestionsAndInfo',
        required: false,
        label:
          "Please use this space to provide any other information you'd like to share or questions you may have.",
        type: 'textarea',
      },
      {
        name: 'longTermCommitment',
        label:
          'Are you ABSOLUTELY SURE that you are ready to make this LONG TERM COMMITMENT?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'unknownHistory',
        label:
          'I/We understand that there is often little or no prior history on the rescued dogs Loves Legacy Rescue has available for adoption.',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'ageRequirement',
        label:
          "Loves Legacy Rescue's Policy requires all applicants must be 21 years of age or older. By checking the box, you are acknowledging, you are 21 years of age or older.",
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'termsAndConditions',
        label:
          ' The undersigned acknowledges receipt of information regarding the physical and personality characteristics of the dog being adopted. The undersigned also acknowledges the risks and responsibilities associated with owning a dog and freely accepts them, and waives any rights to make a claim against the current owner of the dog in the event that the dog bites, or causes injury, destroys property or succumbs to health problems that existed before or at the time of transfer.   The undersigned also agrees that, in the event s/he can no longer provide a safe home for the dog being adopted, s/he will consult with Love’s Legacy Rescue and return the dog if requested to do so.',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'signature',
        label:
          'By checking this box, I understand that the above constitutes a legal signature.',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
    ],
  },
];

export interface FormFieldValue<
  T = string | number | boolean | string[] | Date
> {
  value: T;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

// Main state type (add this to your codebase)
export interface AdoptionFormState {
  // Dog Info
  dogName: FormFieldValue<string>;
  isGift: FormFieldValue<'yes' | 'no'>;
  dogExperience: FormFieldValue<string>;
  breedExperience: FormFieldValue<string>;

  // Adopter Info
  firstName: FormFieldValue<string>;
  lastName: FormFieldValue<string>;
  email: FormFieldValue<string>;
  phone: FormFieldValue<string>;
  phoneType: FormFieldValue<'mobile' | 'home' | 'work'>;
  address1: FormFieldValue<string>;
  address2: FormFieldValue<string>;
  city: FormFieldValue<string>;
  zip: FormFieldValue<string>;
  zipCode: FormFieldValue<string>;
  socialMedia: FormFieldValue<string>;
  adopterAge: FormFieldValue<string>;
  occupation: FormFieldValue<string>;
  employer: FormFieldValue<string>;
  lengthOfEmployment: FormFieldValue<string>;

  // Household Info
  significantOther: FormFieldValue<boolean>;
  partnerName: FormFieldValue<string>;
  partnerOccupation: FormFieldValue<string>;
  householdMembers: FormFieldValue<string>;
  dogAllergies: FormFieldValue<string>;

  // Housing Info
  ownsOrRents: FormFieldValue<'own' | 'rent' | 'other'>;
  housingOtherExplain: FormFieldValue<string>;
  landlordName: FormFieldValue<string>;
  landlordPhone: FormFieldValue<string>;
  landlordEmail: FormFieldValue<string>;
  allowsDogs: FormFieldValue<'yes' | 'no'>;
  breedRestrictions: FormFieldValue<'yes' | 'no'>;
  hoa: FormFieldValue<'yes' | 'no'>;
  hoaBreedRestrictions: FormFieldValue<'yes' | 'no'>;
  houseType: FormFieldValue<
    'house' | 'townhome' | 'apartment' | 'mobile_home' | 'other'
  >;
  hasFence: FormFieldValue<boolean>;
  fenceType: FormFieldValue<string>;

  // Current Pets
  numberOfPets: FormFieldValue<number>;
  [key: `petName${number}`]: FormFieldValue<string>;
  [key: `petSpecies${number}`]: FormFieldValue<string>;
  [key: `petSex${number}`]: FormFieldValue<string>;
  [key: `petAge${number}`]: FormFieldValue<string>;
  [key: `spayedOrNeutered${number}`]: FormFieldValue<string>; // Use string ("yes"/"no") for flexibility in the form UI
  [key: `petBreed${number}`]: FormFieldValue<string>;

  // Lifestyle & Care
  vetName: FormFieldValue<string>;
  motivation: FormFieldValue<string>;
  petEnergyLevel: FormFieldValue<'low' | 'medium' | 'high'>;
  dogFood: FormFieldValue<string>;
  howActiveIsYourHousehold: FormFieldValue<
    'low' | 'light' | 'moderate' | 'high'
  >;
  dailyExerciseAndEnrichment: FormFieldValue<string>;
  offLimitsPlaces: FormFieldValue<string>;
  hoursAlone: FormFieldValue<string>;
  whereDogWillBeWhenAlone: FormFieldValue<string[]>; // CheckboxGroup!
  travelPlans: FormFieldValue<string>;
  openToOtherDogs: FormFieldValue<'yes' | 'no' | 'notApplicable'>;

  // Additional Questions
  petTakenToShelter: FormFieldValue<string>;
  everGaveUpPet: FormFieldValue<string>;
  giveUpPet: FormFieldValue<string>;
  euthanizeDog: FormFieldValue<string>;
  moveWithoutDog: FormFieldValue<string>;

  // Training & Behavior
  trainingExperience: FormFieldValue<string>;
  familiarWithCutOffCues: FormFieldValue<
    'veryFamiliar' | 'somewhatFamiliar' | 'notFamiliar'
  >;
  trainingPlans: FormFieldValue<string[]>; // CheckboxGroup
  difficultBehaviors: FormFieldValue<string>;
  dogSocialization: FormFieldValue<string>;
  petIntroduction: FormFieldValue<string>;

  // Final Agreements & Disclosures
  destructiveBehavior: FormFieldValue<'yes' | 'no'>;
  costOfDog: FormFieldValue<'yes' | 'no'>;
  dogHousebreaking: FormFieldValue<'yes' | 'no'>;
  willingToTrain: FormFieldValue<'yes' | 'no' | 'depends'>;
  dateReadyToAdopt: FormFieldValue<Date | string>; // Support both for easier integration
  photos: FormFieldValue<File[]>;
  howDidYouHearAboutUs: FormFieldValue<
    | 'petfinder'
    | 'facebook'
    | 'instagram'
    | 'google'
    | 'friendOrFamily'
    | 'adoptionEvent'
    | 'other'
  >;
  additionalQuestionsAndInfo: FormFieldValue<string>;
  longTermCommitment: FormFieldValue<'yes' | 'no'>;
  unknownHistory: FormFieldValue<'yes' | 'no'>;
  ageRequirement: FormFieldValue<'yes' | 'no'>;
  termsAndConditions: FormFieldValue<'yes' | 'no'>;
  signature: FormFieldValue<'yes' | 'no'>;
}

export type FieldValue = string | number | boolean | string[] | File[];

export type FieldState = Record<string, FieldValue>;
export interface PetFields {
  name: string;
  species: string;
  age: string;
  sex: string;
  spayedOrNeutered: boolean;
  breed: string;
}

export interface AdoptionFormSection<T = FieldState> {
  id: string;
  title: string;
  description?: string;
  fields: AdoptionFieldConfig<T>[];
}
