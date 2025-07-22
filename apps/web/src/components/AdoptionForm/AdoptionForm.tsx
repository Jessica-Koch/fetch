// apps/web/src/components/AdoptionForm/AdoptionForm.tsx
import { useEffect, useState } from 'react';
import {
  AdoptionFieldConfig,
  adoptionFields,
  FieldValue,
  PetFields,
  AdoptionFormState,
  FormFieldValue,
  FieldState,
} from './AdoptionForm.types';
import { Button } from '../Button/Button';
import { Dog, AdoptionApplicationSubmission } from '@fetch/shared';
import { useRenderField } from '../../hooks/useRenderField';

const createFormField = <T extends FieldValue>(
  initialValue: T,
  onChange: (value: T) => void
): FormFieldValue<T> => ({
  value: initialValue,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    let newValue: T;

    if (target.type === 'checkbox') {
      newValue = (target as HTMLInputElement).checked as T;
    } else if (target.type === 'number') {
      newValue = Number(target.value) as T;
    } else {
      newValue = target.value as T;
    }

    onChange(newValue);
  },
});

const createInitialFormState = (): AdoptionFormState => {
  // This will be replaced with proper state setters
  const handleFieldChange =
    (fieldName: keyof AdoptionFormState) => (value: FieldValue) => {
      console.log('Field change:', fieldName, value);
    };

  return {
    // Dog Info
    selectedDogs: { dogs: [], other: '' },
    isGift: createFormField('no' as const, handleFieldChange('isGift')),
    dogExperience: createFormField('', handleFieldChange('dogExperience')),
    breedExperience: createFormField('', handleFieldChange('breedExperience')),

    // Adopter Info
    firstName: createFormField('', handleFieldChange('firstName')),
    lastName: createFormField('', handleFieldChange('lastName')),
    email: createFormField('', handleFieldChange('email')),
    phone: createFormField('', handleFieldChange('phone')),
    phoneType: createFormField(
      'mobile' as const,
      handleFieldChange('phoneType')
    ),
    address1: createFormField('', handleFieldChange('address1')),
    address2: createFormField('', handleFieldChange('address2')),
    city: createFormField('', handleFieldChange('city')),
    zip: createFormField('', handleFieldChange('zip')),
    zipCode: createFormField('', handleFieldChange('zipCode')),
    socialMedia: createFormField('', handleFieldChange('socialMedia')),
    adopterAge: createFormField('', handleFieldChange('adopterAge')),
    occupation: createFormField('', handleFieldChange('occupation')),
    employer: createFormField('', handleFieldChange('employer')),
    lengthOfEmployment: createFormField(
      '',
      handleFieldChange('lengthOfEmployment')
    ),

    // Household Info
    significantOther: createFormField(
      false,
      handleFieldChange('significantOther')
    ),
    partnerName: createFormField('', handleFieldChange('partnerName')),
    partnerOccupation: createFormField(
      '',
      handleFieldChange('partnerOccupation')
    ),
    householdMembers: createFormField(
      '',
      handleFieldChange('householdMembers')
    ),
    dogAllergies: createFormField('', handleFieldChange('dogAllergies')),

    // Housing Info
    ownsOrRents: createFormField(
      'own' as const,
      handleFieldChange('ownsOrRents')
    ),
    housingOtherExplain: createFormField(
      '',
      handleFieldChange('housingOtherExplain')
    ),
    landlordName: createFormField('', handleFieldChange('landlordName')),
    landlordPhone: createFormField('', handleFieldChange('landlordPhone')),
    landlordEmail: createFormField('', handleFieldChange('landlordEmail')),
    allowsDogs: createFormField(
      'yes' as const,
      handleFieldChange('allowsDogs')
    ),
    breedRestrictions: createFormField(
      'no' as const,
      handleFieldChange('breedRestrictions')
    ),
    hoa: createFormField('no' as const, handleFieldChange('hoa')),
    hoaBreedRestrictions: createFormField(
      'no' as const,
      handleFieldChange('hoaBreedRestrictions')
    ),
    houseType: createFormField(
      'house' as const,
      handleFieldChange('houseType')
    ),
    hasFence: createFormField(false, handleFieldChange('hasFence')),
    fenceType: createFormField('', handleFieldChange('fenceType')),

    // Current Pets - just the base field, repeated fields will be handled dynamically
    numberOfPets: createFormField(0, handleFieldChange('numberOfPets')),

    // Lifestyle & Care
    vetName: createFormField('', handleFieldChange('vetName')),
    motivation: createFormField('', handleFieldChange('motivation')),
    petEnergyLevel: createFormField(
      'medium' as const,
      handleFieldChange('petEnergyLevel')
    ),
    dogFood: createFormField('', handleFieldChange('dogFood')),
    howActiveIsYourHousehold: createFormField(
      'moderate' as const,
      handleFieldChange('howActiveIsYourHousehold')
    ),
    dailyExerciseAndEnrichment: createFormField(
      '',
      handleFieldChange('dailyExerciseAndEnrichment')
    ),
    offLimitsPlaces: createFormField('', handleFieldChange('offLimitsPlaces')),
    hoursAlone: createFormField('', handleFieldChange('hoursAlone')),
    whereDogWillBeWhenAlone: createFormField(
      [] as string[],
      handleFieldChange('whereDogWillBeWhenAlone')
    ),
    travelPlans: createFormField('', handleFieldChange('travelPlans')),
    openToOtherDogs: createFormField(
      'yes' as const,
      handleFieldChange('openToOtherDogs')
    ),

    // Additional Questions
    petTakenToShelter: createFormField(
      '',
      handleFieldChange('petTakenToShelter')
    ),
    everGaveUpPet: createFormField('', handleFieldChange('everGaveUpPet')),
    giveUpPet: createFormField('', handleFieldChange('giveUpPet')),
    euthanizeDog: createFormField('', handleFieldChange('euthanizeDog')),
    moveWithoutDog: createFormField('', handleFieldChange('moveWithoutDog')),

    // Training & Behavior
    trainingExperience: createFormField(
      '',
      handleFieldChange('trainingExperience')
    ),
    familiarWithCutOffCues: createFormField(
      'notFamiliar' as const,
      handleFieldChange('familiarWithCutOffCues')
    ),
    trainingPlans: createFormField(
      [] as string[],
      handleFieldChange('trainingPlans')
    ),
    difficultBehaviors: createFormField(
      '',
      handleFieldChange('difficultBehaviors')
    ),
    dogSocialization: createFormField(
      '',
      handleFieldChange('dogSocialization')
    ),
    petIntroduction: createFormField('', handleFieldChange('petIntroduction')),

    // Final Agreements & Disclosures
    destructiveBehavior: createFormField(
      'no' as const,
      handleFieldChange('destructiveBehavior')
    ),
    costOfDog: createFormField('no' as const, handleFieldChange('costOfDog')),
    dogHousebreaking: createFormField(
      'no' as const,
      handleFieldChange('dogHousebreaking')
    ),
    willingToTrain: createFormField(
      'yes' as const,
      handleFieldChange('willingToTrain')
    ),
    dateReadyToAdopt: createFormField(
      '',
      handleFieldChange('dateReadyToAdopt')
    ),
    photos: createFormField([] as File[], handleFieldChange('photos')),
    howDidYouHearAboutUs: createFormField(
      'petfinder' as const,
      handleFieldChange('howDidYouHearAboutUs')
    ),
    additionalQuestionsAndInfo: createFormField(
      '',
      handleFieldChange('additionalQuestionsAndInfo')
    ),
    longTermCommitment: createFormField(
      'yes' as const,
      handleFieldChange('longTermCommitment')
    ),
    unknownHistory: createFormField(
      'yes' as const,
      handleFieldChange('unknownHistory')
    ),
    ageRequirement: createFormField(
      'yes' as const,
      handleFieldChange('ageRequirement')
    ),
    termsAndConditions: createFormField(
      'no' as const,
      handleFieldChange('termsAndConditions')
    ),
    signature: createFormField('no' as const, handleFieldChange('signature')),
  } as AdoptionFormState;
};

export const AdoptionForm = () => {
  const [form, setForm] = useState<AdoptionFormState>(() =>
    createInitialFormState()
  );
  const [pets, setPets] = useState<PetFields[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const totalSections = adoptionFields.length;
  const currentSection = adoptionFields[currentSectionIndex];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDogs, setSelectedDogs] = useState<Dog[]>([]);
  const [otherDogName, setOtherDogName] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use the custom hook with all required props - convert form to FieldState for compatibility
  const formAsFieldState: FieldState = Object.entries(form).reduce(
    (acc, [key, value]) => {
      if (key === 'selectedDogs') {
        acc[key] = value;
      } else if (value && typeof value === 'object' && 'value' in value) {
        acc[key] = (value as FormFieldValue<FieldValue>).value;
      } else {
        acc[key] = value as FieldValue;
      }
      return acc;
    },
    {} as FieldState
  );

  const { renderField } = useRenderField({
    form: formAsFieldState,
    errors,
    onFieldChange: handleFieldChange,
    photos,
    onPhotosChange: setPhotos,
    selectedDogs,
    onSelectedDogsChange: setSelectedDogs,
    otherDogName,
    onOtherDogNameChange: setOtherDogName,
  });

  function handleFieldChange(field: string, value: FieldValue) {
    setForm((prev) => {
      // Create a proper update for the specific field
      const fieldUpdate = { ...prev };

      // Handle special cases
      if (field === 'selectedDogs') {
        fieldUpdate.selectedDogs = value as unknown as {
          dogs: Dog[];
          other: string;
        };
      } else {
        // For FormFieldValue fields, update the value property
        const currentField = (prev as unknown as Record<string, unknown>)[
          field
        ];
        if (
          currentField &&
          typeof currentField === 'object' &&
          'value' in currentField &&
          'onChange' in currentField
        ) {
          (fieldUpdate as unknown as Record<string, unknown>)[field] = {
            ...currentField,
            value: value,
          };
        }
      }

      return fieldUpdate;
    });

    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }

  // Handle repeated pets fields
  useEffect(() => {
    const numberOfPetsField = form.numberOfPets;
    const numberOfPets = Math.max(
      0,
      Math.min(Number(numberOfPetsField.value) || 0, 10)
    );
    setPets((curr) => {
      const arr = curr.slice(0, numberOfPets);
      while (arr.length < numberOfPets) {
        arr.push({
          name: '',
          species: '',
          age: '',
          sex: '',
          spayedOrNeutered: false,
          breed: '',
        });
      }
      return arr;
    });
  }, [form.numberOfPets]);

  const validateSection = () => {
    const activeSection = adoptionFields[currentSectionIndex];
    const newErrors: Record<string, string> = {};

    activeSection.fields.forEach((field) => {
      if (field.required) {
        if (typeof field.condition === 'function' && !field.condition(form)) {
          return;
        }

        // Special validation for dogSelector
        if (field.type === 'dogSelector') {
          if (selectedDogs.length === 0 && !otherDogName.trim()) {
            newErrors[field.name] =
              'Please select at least one dog or specify another dog.';
          }
          return;
        }

        // Get the field value - handle both FormFieldValue and direct values
        const formField = (form as unknown as Record<string, unknown>)[
          field.name
        ];
        let val: FieldValue;

        if (
          formField &&
          typeof formField === 'object' &&
          'value' in formField
        ) {
          val = (formField as FormFieldValue<FieldValue>).value;
        } else {
          val = formField as FieldValue;
        }

        if (
          val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0)
        ) {
          const fieldLabel =
            typeof field.label === 'function' ? field.label(0) : field.label;
          newErrors[field.name] = `${fieldLabel} is required.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onNextButtonClick = () => {
    if (validateSection()) {
      setErrors({});
      setCurrentSectionIndex((i) => i + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length < 5) {
      alert('Please upload at least 5 photos/videos.');
      return;
    }

    if (selectedDogs.length === 0 && !otherDogName.trim()) {
      alert('Please select at least one dog to apply for.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Upload photos to S3/storage first and get URLs
      const photoUrls: string[] = []; // This would be populated after upload

      // Helper functions to safely get form values with proper types
      const getFormValue = (key: string): string => {
        const formField = (form as unknown as Record<string, unknown>)[key];
        if (
          formField &&
          typeof formField === 'object' &&
          'value' in formField
        ) {
          const value = (formField as FormFieldValue<FieldValue>).value;
          if (typeof value === 'string') return value;
          if (typeof value === 'number') return value.toString();
          return '';
        }
        return '';
      };

      const getFormBool = (key: string): boolean => {
        const formField = (form as unknown as Record<string, unknown>)[key];
        if (
          formField &&
          typeof formField === 'object' &&
          'value' in formField
        ) {
          return Boolean((formField as FormFieldValue<FieldValue>).value);
        }
        return false;
      };

      const getFormArray = (key: string): string[] => {
        const formField = (form as unknown as Record<string, unknown>)[key];
        if (
          formField &&
          typeof formField === 'object' &&
          'value' in formField
        ) {
          const value = (formField as FormFieldValue<FieldValue>).value;
          return Array.isArray(value) &&
            value.every((item) => typeof item === 'string')
            ? value
            : [];
        }
        return [];
      };

      // Prepare submission data
      const submission: AdoptionApplicationSubmission = {
        selectedDogs: selectedDogs.map((dog) => dog.id),

        // Adopter info
        firstName: getFormValue('firstName'),
        lastName: getFormValue('lastName'),
        email: getFormValue('email'),
        phone: getFormValue('phone'),
        phoneType: getFormValue('phoneType') as 'MOBILE' | 'HOME' | 'WORK',
        address1: getFormValue('address1'),
        address2: getFormValue('address2') || undefined,
        city: getFormValue('city'),
        state: getFormValue('state'),
        zipCode: getFormValue('zipCode'),
        socialMedia: getFormValue('socialMedia') || undefined,
        adopterAge: getFormValue('adopterAge'),
        occupation: getFormValue('occupation'),
        employer: getFormValue('employer'),
        lengthOfEmployment: getFormValue('lengthOfEmployment'),

        // All other form fields
        dogName: getFormValue('dogName'),
        isGift: getFormValue('isGift') as 'yes' | 'no',
        dogExperience: getFormValue('dogExperience'),
        breedExperience: getFormValue('breedExperience'),
        significantOther: getFormBool('significantOther'),
        partnerName: getFormValue('partnerName') || undefined,
        partnerOccupation: getFormValue('partnerOccupation') || undefined,
        householdMembers: getFormValue('householdMembers'),
        dogAllergies: getFormValue('dogAllergies'),
        ownsOrRents: getFormValue('ownsOrRents') as 'own' | 'rent' | 'other',
        housingOtherExplain: getFormValue('housingOtherExplain') || undefined,
        landlordName: getFormValue('landlordName') || undefined,
        landlordPhone: getFormValue('landlordPhone') || undefined,
        landlordEmail: getFormValue('landlordEmail') || undefined,
        allowsDogs: (getFormValue('allowsDogs') as 'yes' | 'no') || undefined,
        breedRestrictions:
          (getFormValue('breedRestrictions') as 'yes' | 'no') || undefined,
        hoa: (getFormValue('hoa') as 'yes' | 'no') || undefined,
        hoaBreedRestrictions:
          (getFormValue('hoaBreedRestrictions') as 'yes' | 'no') || undefined,
        houseType: getFormValue('houseType') as
          | 'house'
          | 'townhome'
          | 'apartment'
          | 'mobile_home'
          | 'other',
        hasFence: getFormBool('hasFence'),
        fenceType: getFormValue('fenceType') || undefined,
        numberOfPets: getFormValue('numberOfPets'),
        pets: pets,
        vetName: getFormValue('vetName'),
        motivation: getFormValue('motivation'),
        petEnergyLevel: getFormValue('petEnergyLevel') as
          | 'low'
          | 'medium'
          | 'high',
        dogFood: getFormValue('dogFood'),
        howActiveIsYourHousehold: getFormValue('howActiveIsYourHousehold') as
          | 'low'
          | 'light'
          | 'moderate'
          | 'high',
        dailyExerciseAndEnrichment: getFormValue('dailyExerciseAndEnrichment'),
        offLimitsPlaces: getFormValue('offLimitsPlaces'),
        hoursAlone: getFormValue('hoursAlone'),
        whereDogWillBeWhenAlone: getFormArray('whereDogWillBeWhenAlone'),
        travelPlans: getFormValue('travelPlans'),
        openToOtherDogs: getFormValue('openToOtherDogs') as
          | 'yes'
          | 'no'
          | 'notApplicable',
        petTakenToShelter: getFormValue('petTakenToShelter'),
        everGaveUpPet: getFormValue('everGaveUpPet'),
        giveUpPet: getFormValue('giveUpPet'),
        euthanizeDog: getFormValue('euthanizeDog'),
        moveWithoutDog: getFormValue('moveWithoutDog'),
        trainingExperience: getFormValue('trainingExperience'),
        familiarWithCutOffCues: getFormValue('familiarWithCutOffCues') as
          | 'veryFamiliar'
          | 'somewhatFamiliar'
          | 'notFamiliar',
        trainingPlans: getFormArray('trainingPlans'),
        difficultBehaviors: getFormValue('difficultBehaviors'),
        dogSocialization: getFormValue('dogSocialization'),
        petIntroduction: getFormValue('petIntroduction') || undefined,
        destructiveBehavior: getFormValue('destructiveBehavior') as
          | 'yes'
          | 'no',
        costOfDog: getFormValue('costOfDog') as 'yes' | 'no',
        dogHousebreaking: getFormValue('dogHousebreaking') as 'yes' | 'no',
        willingToTrain: getFormValue('willingToTrain') as
          | 'yes'
          | 'no'
          | 'depends',
        dateReadyToAdopt: getFormValue('dateReadyToAdopt'),
        howDidYouHearAboutUs: getFormValue('howDidYouHearAboutUs') as
          | 'petfinder'
          | 'facebook'
          | 'instagram'
          | 'google'
          | 'friendOrFamily'
          | 'adoptionEvent'
          | 'other',
        additionalQuestionsAndInfo:
          getFormValue('additionalQuestionsAndInfo') || undefined,
        longTermCommitment: getFormValue('longTermCommitment') as 'yes' | 'no',
        unknownHistory: getFormValue('unknownHistory') as 'yes' | 'no',
        ageRequirement: getFormValue('ageRequirement') as 'yes' | 'no',
        termsAndConditions: getFormValue('termsAndConditions') as 'yes' | 'no',
        signature: getFormValue('signature') as 'yes' | 'no',
        photoUrls,
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit application'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div>
        <h2>Application Submitted Successfully!</h2>
        <p>
          Thank you for your adoption application. We will review it and get
          back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adoption Application</h2>
      <div>
        <h3>{currentSection.title}</h3>

        {/* Show selected dogs if any */}
        {selectedDogs.length > 0 && (
          <div>
            <h4>Selected Dogs:</h4>
            <ul>
              {selectedDogs.map((dog) => (
                <li key={dog.id}>
                  {dog.name} ({dog.breed})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show other dog name if specified */}
        {otherDogName && (
          <div>
            <h4>Other Dog:</h4>
            <p>{otherDogName}</p>
          </div>
        )}

        <div>
          {currentSection.fields.map((field) =>
            renderField(field as unknown as AdoptionFieldConfig<FieldState>)
          )}
        </div>

        {submitError && (
          <div style={{ color: 'red', marginTop: 10, marginBottom: 10 }}>
            Error: {submitError}
          </div>
        )}

        <div>
          {currentSectionIndex > 0 && (
            <Button
              type='button'
              label='Back'
              onClick={() => setCurrentSectionIndex((i) => i - 1)}
            />
          )}
          {currentSectionIndex < totalSections - 1 ? (
            <Button type='button' label='Next' onClick={onNextButtonClick} />
          ) : (
            <Button
              type='submit'
              label={submitting ? 'Submitting...' : 'Submit'}
              disabled={submitting}
            />
          )}
        </div>
      </div>
    </form>
  );
};
