import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { Prisma } from '@prisma/client';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() data: Prisma.TripCreateInput) {
    return this.tripsService.create(data);
  }

  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Post(':id/locations')
  addLocation(
    @Param('id') id: string,
    @Body() data: Omit<Prisma.LocationLogCreateInput, 'trip'>,
  ) {
    return this.tripsService.addLocation(id, data);
  }

  @Post(':id/alerts')
  createAlert(
    @Param('id') id: string,
    @Body() data: Omit<Prisma.SafetyAlertCreateInput, 'trip'>,
  ) {
    return this.tripsService.createAlert(id, data);
  }
}
