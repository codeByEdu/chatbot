import { Client, Message } from 'whatsapp-web.js';
import { ChatMessageInput } from '../../core/domain/entity/chat-message-input';
import { ChatUserOutput } from '../../core/domain/entity/chat-message-output';
import { ChatPlataform } from '../../core/domain/ports/chat-plataform';
import { ChatUser } from '../../core/domain/entity/chat-user';


export class WhatsAppChatPlataform implements ChatPlataform {
    private client = Client();

    async receiveChatMessage(): Promise<ChatMessageInput>{
        this.client = new Client();
        this.client.on('message', async (message: Message) => {
            const messageText = message.body;
            const userTel = message.from;

            const chatMessageProps ={
                message: messageText,
                chatUser: userTel
            }
            const chatUserInput =  ChatMessageInput.create(chatMessageProps);
    
            return chatUserInput;
        });
    }

}
