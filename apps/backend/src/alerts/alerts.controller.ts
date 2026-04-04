import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() body: {
    tripId: string;
    type: string;
    severity: string;
    message: string;
  }) {
    return this.alertsService.create(body);
  }

  @Get()
  async findAll() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id/resolve')
  async resolve(@Param('id') id: string) {
    return this.alertsService.resolve(id);
  }
}
