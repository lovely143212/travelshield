"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let TripsService = class TripsService {
    prisma;
    httpService;
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async create(data) {
        return this.prisma.trip.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.trip.findMany({
            include: { user: true, locationLogs: true, alerts: true },
        });
    }
    async findOne(id) {
        return this.prisma.trip.findUnique({
            where: { id },
            include: { user: true, locationLogs: true, alerts: true, budgetLogs: true },
        });
    }
    async addLocation(tripId, data) {
        const location = await this.prisma.locationLog.create({
            data: {
                ...data,
                trip: { connect: { id: tripId } },
            },
        });
        const recentLocations = await this.prisma.locationLog.findMany({
            where: { tripId },
            orderBy: { timestamp: 'desc' },
            take: 10,
        });
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/analyze-safety', {
                tripId,
                locations: recentLocations.map(l => ({
                    latitude: l.latitude,
                    longitude: l.longitude,
                    altitude: l.altitude,
                    timestamp: l.timestamp,
                })),
            }));
            const safetyResult = response.data;
            if (safetyResult.isAnomaly) {
                await this.createAlert(tripId, {
                    type: 'ANOMALY',
                    severity: safetyResult.safetyScore < 0.5 ? 'CRITICAL' : 'HIGH',
                    message: safetyResult.reason,
                });
            }
        }
        catch (err) {
            console.error('AI safety analysis failed', err.message);
        }
        return location;
    }
    async createAlert(tripId, data) {
        return this.prisma.safetyAlert.create({
            data: {
                ...data,
                trip: { connect: { id: tripId } },
            },
        });
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], TripsService);
//# sourceMappingURL=trips.service.js.map