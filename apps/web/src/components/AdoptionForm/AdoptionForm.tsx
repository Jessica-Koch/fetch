// apps/web/src/components/AdoptionForm/AdoptionForm.tsx
import { useEffect, useState } from 'react';
import {
  AdoptionFieldConfig,
  adoptionFields,
  FieldState,
  FieldValue,
  PetFields,
} from './AdoptionForm.types';
import { Button } from '../Button/Button';
import { Dog, AdoptionApplicationSubmission } from '@fetch/shared';
import { useRenderField } from '../../hooks/useRenderField';

const getInitialState = (fields: AdoptionFieldConfig[]): FieldState => {
  const state: FieldState = {};
  fields.forEach((field) => {
    if (field.repeat) return;
    switch (field.type) {
      case 'checkbox':
        state[field.name] = false;
        break;
      case 'number':
        state[field.name] = 0;
        break;
      case 'checkboxGroup':
        state[field.name] = [];
        break;
      case 'file':
        state[field.name] = [];
        break;
      case 'radio':
      case 'select':
        state[field.name] = field.options?.[0]?.value ?? '';
        break;
      case 'dogSelector':
        state[field.name] = { dogs: [], other: '' };
        break;
      default:
        state[field.name] = '';
    }
  });
  return state;
};

// flatten all fields for initial state
const allFields = adoptionFields.flatMap((section) => section.fields);

export const AdoptionForm = () => {
  const [form, setForm] = useState<FieldState>(getInitialState(allFields));
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

  // Use the custom hook with all required props
  const { renderField } = useRenderField({
    form,
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
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const { [field]: removed, ...rest } = prev;
      return rest;
    });
  }

  // Handle repeated pets fields
  useEffect(() => {
    const numberOfPets = Math.max(
      0,
      Math.min(Number(form.numberOfPets) || 0, 10)
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

        const val = form[field.name];
        if (
          val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newErrors[field.name] = `${field.label} is required.`;
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
        const value = form[key];
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return '';
      };

      const getFormBool = (key: string): boolean => Boolean(form[key]);

      const getFormArray = (key: string): string[] => {
        const value = form[key];
        return Array.isArray(value) &&
          value.every((item) => typeof item === 'string')
          ? value
          : [];
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

        <div>{currentSection.fields.map((field) => renderField(field))}</div>

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
