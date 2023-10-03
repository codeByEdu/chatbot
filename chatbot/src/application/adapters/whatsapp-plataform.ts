import { Client, Message } from 'whatsapp-web.js';
import { ChatMessageInput } from '../../core/domain/entity/chat-message-input';
import { ChatUserOutput } from '../../core/domain/entity/chat-message-output';
import { ChatPlataform } from '../../core/domain/ports/chat-plataform';
import { ChatUser } from '../../core/domain/entity/chat-user';


export class WhatsAppChatPlataform implements ChatPlataform {
    
    async receiveChatMessage(message: ChatMessageInput): Promise<ChatUserOutput>{

        return chatUserOutput;
    }
}
