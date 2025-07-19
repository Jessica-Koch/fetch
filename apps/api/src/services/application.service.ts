import { ObjectId } from 'mongodb';
import { PrismaClient } from '@prisma/client';
import { AdoptionApplication } from '../models/application.model';
import { getApplicationsCollection } from './mongodb.service';
import { get } from 'http';

export class ApplicationService {
  constructor(private prisma: PrismaClient) {}

  // Create a new adoption application
  async createApplication(
    data: Omit<AdoptionApplication, '_id' | 'submittedAt' | 'updatedAt'>
  ): Promise<AdoptionApplication> {
    const applications = await getApplicationsCollection();

    // Check if adopter exists in PostgreSQl
    const adopter = await this.prisma.adopter.findUnique({
      where: { id: data.adopterId },
    });

    if (!adopter) {
      throw new Error('Adopter not found');
    }

    const dogs = await this.prisma.dog.findMany({
      where: { id: { in: data.dogIds } },
    });

    if (dogs.length !== data.dogIds.length) {
      throw new Error('One or more dogs not found');
    }

    // Create appklication with timestamps
    const application: AdoptionApplication = {
      ...data,
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await applications.insertOne(application);

    // Update adopter with applicaiton reference
    await this.prisma.adopter.update({
      where: { id: data.adopterId },
      data: {
        applicationIds: {
          push: result.insertedId.toString(),
        },
      },
    });

    return { ...application, _id: result.insertedId };
  }

  async getApplicationById(id: string): Promise<AdoptionApplication | null> {
    const applications = await getApplicationsCollection();
    return applications.findOne({ _id: new ObjectId(id) });
  }

  async getApplicationsByAdopter(
    adopterId: string
  ): Promise<AdoptionApplication[]> {
    const applications = await getApplicationsCollection();
    return applications.find({ adopterId }).sort({ submittedAt: -1 }).toArray();
  }

  async getApplicationsForDog(dogId: string): Promise<AdoptionApplication[]> {
    const applications = await getApplicationsCollection();
    return applications
      .find({ dogIds: dogId })
      .sort({ submittedAt: -1 })
      .toArray();
  }

  async getApplicationsByStatus(
    status: AdoptionApplication['status']
  ): Promise<AdoptionApplication[]> {
    const applications = await getApplicationsCollection();
    return applications.find({ status }).sort({ submittedAt: -1 }).toArray();
  }

  async updateApplicationStatus(
    id: string,
    status: AdoptionApplication['status'],
    reviewedBy?: string,
    reviewNotes?: string
  ): Promise<AdoptionApplication | null> {
    const applications = await getApplicationsCollection();

    const update: any = {
      status,
      updatedAt: new Date(),
    };

    if (reviewedBy) {
      update.reviewedBy = reviewedBy;
      update.reviewedAt = new Date();
    }

    if (reviewNotes) {
      update.reviewNotes = reviewNotes;
    }

    const result = await applications.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );

    return result;
  }

  async addInternalNote(id: string, note: string): Promise<void> {
    const applications = await getApplicationsCollection();

    await applications.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { internalNotes: note },
        $set: { updatedAt: new Date() },
      }
    );
  }

  async getApplications(filters: {
    status?: AdoptionApplication['status'];
    adopterId?: string;
    dogId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AdoptionApplication[]> {
    const applications = await getApplicationsCollection();
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.adopterId) {
      query.adopterId = filters.adopterId;
    }

    if (filters.dogId) {
      query.dogIds = filters.dogId;
    }

    if (filters.startDate || filters.endDate) {
      query.submittedAt = {};
      if (filters.startDate) {
        query.submittedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.submittedAt.$lte = filters.endDate;
      }
    }

    return applications.find(query).sort({ submittedAt: -1 }).toArray();
  }

  async getApplicationStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    recentApplications: number;
  }> {
    const applications = await getApplicationsCollection();

    const total = await applications.countDocuments();

    const byStatus = await applications
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .toArray();

    const statusCounts = byStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await applications.countDocuments({
      submittedAt: { $gte: thirtyDaysAgo },
    });

    return {
      total,
      byStatus: statusCounts,
      recentApplications,
    };
  }
}
