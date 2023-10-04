import { config } from "dotenv";
import { AiPlataform } from "../core/domain/use-cases/ai-plataform";
import { ChatPlataform } from "../core/domain/use-cases/chat-plataform";
import { OpenAiPlataform } from "./adapters/open-ai-plataform";
import { WhatsAppChatPlataform } from "./adapters/whatsapp-plataform";
config();

const aiPlataform: AiPlataform = new OpenAiPlataform();
const chatPlataform: ChatPlataform = new WhatsAppChatPlataform(aiPlataform);
chatPlataform.createClient();
chatPlataform.initClient();
chatPlataform.startListening();
