import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatbotController } from './chatbot.controller';

@Module({
  imports: [HttpModule],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
