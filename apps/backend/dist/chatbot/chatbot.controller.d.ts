import { HttpService } from '@nestjs/axios';
export declare class ChatbotController {
    private readonly httpService;
    constructor(httpService: HttpService);
    chat(body: {
        message: string;
        context?: any;
    }): Promise<any>;
}
