import { AiRequest } from "../entity/ai-request";
import { AiResponse } from "../entity/ai-response";

export interface AiPlataform {
    sendInterviewResponse(message: string): Promise<AiResponse>
    sendDoubt(message: string): Promise<AiResponse>
    sendPrompt(request: AiRequest, model?: string): Promise<AiResponse>
}