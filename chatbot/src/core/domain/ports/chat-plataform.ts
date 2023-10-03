import { ChatMessageInput } from "../entity/chat-message-input";
import { ChatUserOutput } from "../entity/chat-message-output";

export interface ChatPlataform {
    sendMessage(messageInput: ChatMessageInput): Promise<ChatUserOutput>
}