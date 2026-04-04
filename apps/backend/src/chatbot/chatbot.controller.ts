import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async chat(@Body() body: { message: string; context?: any }) {
    const response = await firstValueFrom(
      this.httpService.post('http://localhost:8000/chat', body),
    );
    return response.data;
  }
}
