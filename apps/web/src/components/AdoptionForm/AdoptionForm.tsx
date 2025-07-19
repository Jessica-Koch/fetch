// apps/web/src/components/AdoptionForm/AdoptionForm.tsx
import { useEffect, useState } from 'react';
import styles from './AdoptionForm.module.scss';
import {
  AdoptionFieldConfig,
  adoptionFields,
  AdoptionFormState,
  FieldState,
  FieldValue,
  PetFields,
} from './AdoptionForm.types';
import { Button } from '../Button/Button';
import { Dog, AdoptionApplicationSubmission } from '@fetch/shared';
import { useRenderField } from '../../hooks/useRenderField';

const getInitialState = (
  fields: AdoptionFieldConfig<AdoptionFormState>[]
): AdoptionFormState => {
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
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use the custom hook
  const { renderField } = useRenderField({
    form,
    errors,
    onFieldChange: handleFieldChange,
    photos,
    onPhotosChange: setPhotos,
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

    if (selectedDogs.length === 0) {
      alert('Please select at least one dog to apply for.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Upload photos to S3/storage first and get URLs
      const photoUrls: string[] = []; // This would be populated after upload

      // Prepare submission data
      const submission: AdoptionApplicationSubmission = {
        selectedDogs: selectedDogs.map((dog) => dog.id),

        // Adopter info
        firstName: form.firstName as string,
        lastName: form.lastName as string,
        email: form.email as string,
        phone: form.phone as string,
        phoneType: form.phoneType as 'MOBILE' | 'HOME' | 'WORK',
        address1: form.address1 as string,
        address2: (form.address2 as string) || undefined,
        city: form.city as string,
        state: form.state as string,
        zipCode: form.zipCode as string,
        socialMedia: (form.socialMedia as string) || undefined,
        adopterAge: form.adopterAge as string,
        occupation: form.occupation as string,
        employer: form.employer as string,
        lengthOfEmployment: form.lengthOfEmployment as string,

        // All other form fields
        dogName: form.dogName as string,
        isGift: form.isGift as 'yes' | 'no',
        dogExperience: form.dogExperience as string,
        breedExperience: form.breedExperience as string,
        significantOther: form.significantOther as boolean,
        partnerName: (form.partnerName as string) || undefined,
        partnerOccupation: (form.partnerOccupation as string) || undefined,
        householdMembers: form.householdMembers as string,
        dogAllergies: form.dogAllergies as string,
        ownsOrRents: form.ownsOrRents as 'own' | 'rent' | 'other',
        housingOtherExplain: (form.housingOtherExplain as string) || undefined,
        landlordName: (form.landlordName as string) || undefined,
        landlordPhone: (form.landlordPhone as string) || undefined,
        landlordEmail: (form.landlordEmail as string) || undefined,
        allowsDogs: (form.allowsDogs as 'yes' | 'no') || undefined,
        breedRestrictions:
          (form.breedRestrictions as 'yes' | 'no') || undefined,
        hoa: (form.hoa as 'yes' | 'no') || undefined,
        hoaBreedRestrictions:
          (form.hoaBreedRestrictions as 'yes' | 'no') || undefined,
        houseType: form.houseType as
          | 'house'
          | 'townhome'
          | 'apartment'
          | 'mobile_home'
          | 'other',
        hasFence: form.hasFence as boolean,
        fenceType: (form.fenceType as string) || undefined,
        numberOfPets: form.numberOfPets as string,
        pets: pets,
        vetName: form.vetName as string,
        motivation: form.motivation as string,
        petEnergyLevel: form.petEnergyLevel as 'low' | 'medium' | 'high',
        dogFood: form.dogFood as string,
        howActiveIsYourHousehold: form.howActiveIsYourHousehold as
          | 'low'
          | 'light'
          | 'moderate'
          | 'high',
        dailyExerciseAndEnrichment: form.dailyExerciseAndEnrichment as string,
        offLimitsPlaces: form.offLimitsPlaces as string,
        hoursAlone: form.hoursAlone as string,
        whereDogWillBeWhenAlone: form.whereDogWillBeWhenAlone as string[],
        travelPlans: form.travelPlans as string,
        openToOtherDogs: form.openToOtherDogs as 'yes' | 'no' | 'notApplicable',
        petTakenToShelter: form.petTakenToShelter as string,
        everGaveUpPet: form.everGaveUpPet as string,
        giveUpPet: form.giveUpPet as string,
        euthanizeDog: form.euthanizeDog as string,
        moveWithoutDog: form.moveWithoutDog as string,
        trainingExperience: form.trainingExperience as string,
        familiarWithCutOffCues: form.familiarWithCutOffCues as
          | 'veryFamiliar'
          | 'somewhatFamiliar'
          | 'notFamiliar',
        trainingPlans: form.trainingPlans as string[],
        difficultBehaviors: form.difficultBehaviors as string,
        dogSocialization: form.dogSocialization as string,
        petIntroduction: (form.petIntroduction as string) || undefined,
        destructiveBehavior: form.destructiveBehavior as 'yes' | 'no',
        costOfDog: form.costOfDog as 'yes' | 'no',
        dogHousebreaking: form.dogHousebreaking as 'yes' | 'no',
        willingToTrain: form.willingToTrain as 'yes' | 'no' | 'depends',
        dateReadyToAdopt: form.dateReadyToAdopt as string,
        howDidYouHearAboutUs: form.howDidYouHearAboutUs as
          | 'petfinder'
          | 'facebook'
          | 'instagram'
          | 'google'
          | 'friendOrFamily'
          | 'adoptionEvent'
          | 'other',
        additionalQuestionsAndInfo:
          (form.additionalQuestionsAndInfo as string) || undefined,
        longTermCommitment: form.longTermCommitment as 'yes' | 'no',
        unknownHistory: form.unknownHistory as 'yes' | 'no',
        ageRequirement: form.ageRequirement as 'yes' | 'no',
        termsAndConditions: form.termsAndConditions as 'yes' | 'no',
        signature: form.signature as 'yes' | 'no',
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
      // Reset form or redirect to success page
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
      <div className={styles.adoptionForm}>
        <h2>Application Submitted Successfully!</h2>
        <p>
          Thank you for your adoption application. We will review it and get
          back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.adoptionForm} onSubmit={handleSubmit}>
      <h2 className={styles.h2}>Adoption Application</h2>
      <div className={styles.formContainer}>
        <h3 className={styles.sectionHeading}>{currentSection.title}</h3>
        {selectedDogs.length > 0 && (
          <div className={styles.selectedDogs}>
            <h4>Selected Dogs:</h4>
            {selectedDogs.map((dog) => (
              <div key={dog.id}>
                {dog.name} ({dog.breed})
              </div>
            ))}
          </div>
        )}
        <div className={styles.formSection}>
          {currentSection.fields.map((field) => renderField(field))}
        </div>
        {submitError && (
          <div style={{ color: 'red', marginTop: 10, marginBottom: 10 }}>
            Error: {submitError}
          </div>
        )}
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
    </form>
  );
};
