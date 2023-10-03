import { AiRequest } from "../entity/ai-request";
import { AiResponse } from "../entity/ai-response";

export interface AiPlataform {
    sendPrompt(request: AiRequest): Promise<AiResponse>
}