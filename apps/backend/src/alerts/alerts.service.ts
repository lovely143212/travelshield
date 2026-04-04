import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    tripId: string;
    type: string;
    severity: string;
    message: string;
  }) {
    return this.prisma.safetyAlert.create({
      data: {
        ...data,
        status: 'OPEN',
      },
    });
  }

  async findAll() {
    return this.prisma.safetyAlert.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        trip: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.safetyAlert.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async resolve(id: string) {
    return this.prisma.safetyAlert.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
  }
}
