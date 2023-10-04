import { ChatMessageInput } from "../entity/chat-message-input";
import { ChatUserOutput } from "../entity/chat-message-output";
import { ChatUser } from "../entity/chat-user";

export interface ChatPlataform {
    createClient(): Promise<void>
    receiveChatMessage(message: ChatMessageInput): Promise<void>
    replyChatMessage(message: ChatUserOutput, chatUser: ChatUser): Promise<void>
    startListening(): Promise<void>
    initClient(): Promise<void>
}