import axios from "axios";
import { AiRequest } from "../../core/domain/entity/ai-request";
import { AiResponse, AiResponseProps } from "../../core/domain/entity/ai-response";
import { AiPlataform } from "../../core/domain/ports/ai-plataform";

export class OpenAiPlataform implements AiPlataform {

    async sendPrompt(request: AiRequest): Promise<AiResponse> {
        const aiMessagesMapeado = request.requestMessages.map((aiMessage) => {
            return {
                role: aiMessage.role,
                content: aiMessage.message
            }
        })
        const body = {
            model: request.model,
            messages: aiMessagesMapeado
        }
        const headers = {
            Authorization: "Bearer -=-=--=-"
        }
        const { data } = await axios.post("https://api.openai.com/v1/chat/completions", body, {
            headers
        })
        const aiResponseProps: AiResponseProps = {
            id: data.id,
            choices: data.choices,
            created: data.created,
            model: data.model,
            object: data.object
        }
        const aiResponse = AiResponse.create(aiResponseProps)
        return aiResponse;
    }
}