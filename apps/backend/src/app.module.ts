import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [PrismaModule, UsersModule, TripsModule, ChatbotModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
