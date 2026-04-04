import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { Trip, Prisma } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(data: Prisma.TripCreateInput): Promise<Trip> {
    return this.prisma.trip.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.trip.findMany({
      include: { user: true, locationLogs: true, alerts: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
      include: { user: true, locationLogs: true, alerts: true, budgetLogs: true },
    });
  }

  async addLocation(tripId: string, data: Omit<Prisma.LocationLogCreateInput, 'trip'>) {
    // 1. Save new location
    const location = await this.prisma.locationLog.create({
      data: {
        ...data,
        trip: { connect: { id: tripId } },
      },
    });

    // 2. Fetch recent locations for AI analysis
    const recentLocations = await this.prisma.locationLog.findMany({
      where: { tripId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // 3. Call AI Service for safety analysis
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/analyze-safety', {
          tripId,
          locations: recentLocations.map(l => ({
            latitude: l.latitude,
            longitude: l.longitude,
            altitude: l.altitude,
            timestamp: l.timestamp,
          })),
        }),
      );

      const safetyResult = response.data;

      // 4. If anomaly detected, create an alert
      if (safetyResult.isAnomaly) {
        await this.createAlert(tripId, {
          type: 'ANOMALY',
          severity: safetyResult.safetyScore < 0.5 ? 'CRITICAL' : 'HIGH',
          message: safetyResult.reason,
        });
      }
    } catch (err) {
      console.error('AI safety analysis failed', err.message);
    }

    return location;
  }

  async createAlert(tripId: string, data: Omit<Prisma.SafetyAlertCreateInput, 'trip'>) {
    return this.prisma.safetyAlert.create({
      data: {
        ...data,
        trip: { connect: { id: tripId } },
      },
    });
  }
}
