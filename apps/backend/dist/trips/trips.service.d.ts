import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { Trip, Prisma } from '@prisma/client';
export declare class TripsService {
    private prisma;
    private readonly httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    create(data: Prisma.TripCreateInput): Promise<Trip>;
    findAll(): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        locationLogs: {
            id: string;
            latitude: number;
            longitude: number;
            altitude: number | null;
            timestamp: Date;
            tripId: string;
        }[];
        alerts: {
            id: string;
            createdAt: Date;
            status: string;
            tripId: string;
            type: string;
            severity: string;
            message: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        startDate: Date;
        endDate: Date | null;
        status: string;
        userId: string;
    })[]>;
    findOne(id: string): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        locationLogs: {
            id: string;
            latitude: number;
            longitude: number;
            altitude: number | null;
            timestamp: Date;
            tripId: string;
        }[];
        alerts: {
            id: string;
            createdAt: Date;
            status: string;
            tripId: string;
            type: string;
            severity: string;
            message: string;
        }[];
        budgetLogs: {
            id: string;
            timestamp: Date;
            tripId: string;
            amount: number;
            category: string;
            description: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        startDate: Date;
        endDate: Date | null;
        status: string;
        userId: string;
    }) | null>;
    addLocation(tripId: string, data: Omit<Prisma.LocationLogCreateInput, 'trip'>): Promise<{
        id: string;
        latitude: number;
        longitude: number;
        altitude: number | null;
        timestamp: Date;
        tripId: string;
    }>;
    createAlert(tripId: string, data: Omit<Prisma.SafetyAlertCreateInput, 'trip'>): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tripId: string;
        type: string;
        severity: string;
        message: string;
    }>;
}
