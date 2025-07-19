// apps/api/src/routes/application.routes.ts
import { FastifyInstance } from 'fastify';
import { ApplicationService } from '../services/application.service';
import { PrismaClient } from '@prisma/client';
import { AdoptionApplication } from '../models/application.model';

export const applicationRoutes = async (
  fastify: FastifyInstance,
  prisma: PrismaClient
) => {
  const applicationService = new ApplicationService(prisma);

  // Submit new application
  fastify.post('/api/applications', async (request, reply) => {
    try {
      const applicationData = request.body as any;

      // First, create or find the adopter in PostgreSQL
      let adopter = await prisma.adopter.findUnique({
        where: { email: applicationData.email },
      });

      if (!adopter) {
        // Create new adopter
        adopter = await prisma.adopter.create({
          data: {
            firstName: applicationData.firstName,
            lastName: applicationData.lastName,
            email: applicationData.email,
            phone: applicationData.phone,
            phoneType: applicationData.phoneType,
            address1: applicationData.address1,
            address2: applicationData.address2,
            city: applicationData.city,
            state: applicationData.state,
            zipCode: applicationData.zipCode,
            socialMedia: applicationData.socialMedia,
            age: applicationData.adopterAge,
            occupation: applicationData.occupation,
            employer: applicationData.employer,
            lengthOfEmployment: applicationData.lengthOfEmployment,
            applicationIds: [],
          },
        });
      }

      // Transform form data to match MongoDB schema
      const application: Omit<
        AdoptionApplication,
        '_id' | 'submittedAt' | 'updatedAt'
      > = {
        adopterId: adopter.id,
        dogIds: applicationData.selectedDogs || [],
        status: 'PENDING',

        dogInfo: {
          dogName: applicationData.dogName,
          isGift: applicationData.isGift,
          dogExperience: applicationData.dogExperience,
          breedExperience: applicationData.breedExperience,
        },

        householdInfo: {
          significantOther: applicationData.significantOther,
          partnerName: applicationData.partnerName,
          partnerOccupation: applicationData.partnerOccupation,
          householdMembers: applicationData.householdMembers,
          dogAllergies: applicationData.dogAllergies,
        },

        housingInfo: {
          ownsOrRents: applicationData.ownsOrRents,
          housingOtherExplain: applicationData.housingOtherExplain,
          landlordName: applicationData.landlordName,
          landlordPhone: applicationData.landlordPhone,
          landlordEmail: applicationData.landlordEmail,
          allowsDogs: applicationData.allowsDogs,
          breedRestrictions: applicationData.breedRestrictions,
          hoa: applicationData.hoa,
          hoaBreedRestrictions: applicationData.hoaBreedRestrictions,
          houseType: applicationData.houseType,
          hasFence: applicationData.hasFence,
          fenceType: applicationData.fenceType,
        },

        currentPets: {
          numberOfPets: parseInt(applicationData.numberOfPets) || 0,
          pets: applicationData.pets || [],
        },

        lifestyleCare: {
          vetName: applicationData.vetName,
          motivation: applicationData.motivation,
          petEnergyLevel: applicationData.petEnergyLevel,
          dogFood: applicationData.dogFood,
          howActiveIsYourHousehold: applicationData.howActiveIsYourHousehold,
          dailyExerciseAndEnrichment:
            applicationData.dailyExerciseAndEnrichment,
          offLimitsPlaces: applicationData.offLimitsPlaces,
          hoursAlone: applicationData.hoursAlone,
          whereDogWillBeWhenAlone:
            applicationData.whereDogWillBeWhenAlone || [],
          travelPlans: applicationData.travelPlans,
          openToOtherDogs: applicationData.openToOtherDogs,
        },

        additionalQuestions: {
          petTakenToShelter: applicationData.petTakenToShelter,
          everGaveUpPet: applicationData.everGaveUpPet,
          giveUpPet: applicationData.giveUpPet,
          euthanizeDog: applicationData.euthanizeDog,
          moveWithoutDog: applicationData.moveWithoutDog,
        },

        trainingBehavior: {
          trainingExperience: applicationData.trainingExperience,
          familiarWithCutOffCues: applicationData.familiarWithCutOffCues,
          trainingPlans: applicationData.trainingPlans || [],
          difficultBehaviors: applicationData.difficultBehaviors,
          dogSocialization: applicationData.dogSocialization,
          petIntroduction: applicationData.petIntroduction,
        },

        photos: applicationData.photoUrls || [], // You'll need to handle file uploads separately

        finalAgreements: {
          destructiveBehavior: applicationData.destructiveBehavior,
          costOfDog: applicationData.costOfDog,
          dogHousebreaking: applicationData.dogHousebreaking,
          willingToTrain: applicationData.willingToTrain,
          dateReadyToAdopt: new Date(applicationData.dateReadyToAdopt),
          howDidYouHearAboutUs: applicationData.howDidYouHearAboutUs,
          additionalQuestionsAndInfo:
            applicationData.additionalQuestionsAndInfo,
          longTermCommitment: applicationData.longTermCommitment,
          unknownHistory: applicationData.unknownHistory,
          ageRequirement: applicationData.ageRequirement,
          termsAndConditions: applicationData.termsAndConditions,
          signature: applicationData.signature,
        },
      };

      const result = await applicationService.createApplication(application);

      reply.code(201);
      return {
        success: true,
        data: result,
        message: 'Application submitted successfully',
      };
    } catch (error) {
      console.error('Error creating application:', error);
      reply.code(500);
      return {
        success: false,
        error: 'Failed to submit application',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get application by ID
  fastify.get<{ Params: { id: string } }>(
    '/api/applications/:id',
    async (request, reply) => {
      try {
        const application = await applicationService.getApplicationById(
          request.params.id
        );

        if (!application) {
          reply.code(404);
          return { error: 'Application not found' };
        }

        return { data: application };
      } catch (error) {
        console.error('Error fetching application:', error);
        reply.code(500);
        return { error: 'Failed to fetch application' };
      }
    }
  );

  // Get applications for a dog
  fastify.get<{ Params: { dogId: string } }>(
    '/api/dogs/:dogId/applications',
    async (request, reply) => {
      try {
        const applications = await applicationService.getApplicationsForDog(
          request.params.dogId
        );
        return { data: applications };
      } catch (error) {
        console.error('Error fetching applications:', error);
        reply.code(500);
        return { error: 'Failed to fetch applications' };
      }
    }
  );

  // Get applications by status
  fastify.get<{ Querystring: { status?: string } }>(
    '/api/applications',
    async (request, reply) => {
      try {
        const { status } = request.query;

        if (status) {
          const applications = await applicationService.getApplicationsByStatus(
            status as any
          );
          return { data: applications };
        }

        // Return all applications if no status filter
        const applications = await applicationService.getApplications({});
        return { data: applications };
      } catch (error) {
        console.error('Error fetching applications:', error);
        reply.code(500);
        return { error: 'Failed to fetch applications' };
      }
    }
  );

  // Update application status
  fastify.patch<{
    Params: { id: string };
    Body: { status: string; reviewNotes?: string };
  }>('/api/applications/:id/status', async (request, reply) => {
    try {
      const { status, reviewNotes } = request.body;

      // In a real app, you'd get the reviewer from the auth session
      const reviewedBy = 'admin@rescue.org';

      const application = await applicationService.updateApplicationStatus(
        request.params.id,
        status as any,
        reviewedBy,
        reviewNotes
      );

      if (!application) {
        reply.code(404);
        return { error: 'Application not found' };
      }

      return { data: application };
    } catch (error) {
      console.error('Error updating application:', error);
      reply.code(500);
      return { error: 'Failed to update application' };
    }
  });

  // Get application statistics
  fastify.get('/api/applications/stats', async (request, reply) => {
    try {
      const stats = await applicationService.getApplicationStats();
      return { data: stats };
    } catch (error) {
      console.error('Error fetching stats:', error);
      reply.code(500);
      return { error: 'Failed to fetch statistics' };
    }
  });

  // Get adopter's applications
  fastify.get<{ Params: { adopterId: string } }>(
    '/api/adopters/:adopterId/applications',
    async (request, reply) => {
      try {
        const applications = await applicationService.getApplicationsByAdopter(
          request.params.adopterId
        );
        return { data: applications };
      } catch (error) {
        console.error('Error fetching applications:', error);
        reply.code(500);
        return { error: 'Failed to fetch applications' };
      }
    }
  );
};
