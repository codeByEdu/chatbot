import { ChatMessageInput } from "../entity/chat-message-input";
import { ChatUserOutput } from "../entity/chat-message-output";
import { ChatUser } from "../entity/chat-user";

export interface ChatPlataform {
    receiveChatMessage(message: ChatMessageInput): Promise<ChatUserOutput>
    replyChatMessage(message: ChatUserOutput, chatUser: ChatUser): Promise<void>
}