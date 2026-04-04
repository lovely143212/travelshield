import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    create(body: {
        tripId: string;
        type: string;
        severity: string;
        message: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tripId: string;
        type: string;
        severity: string;
        message: string;
    }>;
    findAll(): Promise<({
        trip: {
            user: {
                name: string | null;
                id: string;
                email: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date | null;
            status: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        tripId: string;
        type: string;
        severity: string;
        message: string;
    })[]>;
    findOne(id: string): Promise<({
        trip: {
            user: {
                name: string | null;
                id: string;
                email: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date | null;
            status: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        tripId: string;
        type: string;
        severity: string;
        message: string;
    }) | null>;
    resolve(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tripId: string;
        type: string;
        severity: string;
        message: string;
    }>;
}
