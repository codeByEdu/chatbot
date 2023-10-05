import qrcode from "qrcode-terminal";
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { AiResponse } from '../../core/domain/entity/ai-response';
import { ChatMessageInput } from '../../core/domain/entity/chat-message-input';
import { ChatUserOutput } from '../../core/domain/entity/chat-message-output';
import { ChatUser } from '../../core/domain/entity/chat-user';
import { AiPlataform } from '../../core/domain/use-cases/ai-plataform';
import { ChatPlataform } from '../../core/domain/use-cases/chat-plataform';

export class WhatsAppChatPlataform implements ChatPlataform {
    public client: Client;

    constructor(private readonly aiPlataform: AiPlataform) { }

    async initClient(): Promise<void> {
        this.client.initialize();

        this.client.on('qr', (qrCode) => {
            qrcode.generate(qrCode, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Bot inicializado!');
        });
    }

    async createClient(): Promise<void> {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "mack-bot"
            })
        });
    }

    async startListening(): Promise<void> {
        this.client.on('message', async (receivedMessage: Message) => {
            const message = receivedMessage.body;
            const chat = await receivedMessage.getChat();
            const chatUser = {
                chat,
                userId: receivedMessage.from
            };
            const chatMessageProps = {
                message,
                chatUser
            }
            const chatUserInput = ChatMessageInput.create(chatMessageProps);
            await this.receiveChatMessage(chatUserInput);
        });
    }

    async replyChatMessage(chatOutPut: ChatUserOutput, chatUser: ChatUser): Promise<void> {
        const chat = chatUser.chat;
        await chat.sendMessage(chatOutPut.message);
    }

    async receiveChatMessage(chatInput: ChatMessageInput): Promise<void> {
        const chatUser = chatInput.chatUser;
        const userMessage = chatInput.message;

        let aiResponse: AiResponse;
        const isDoubtAboutInternship = chatInput.message.includes("DUVIDAS_ESTAGIO");
        if (isDoubtAboutInternship) {
            aiResponse = await this.aiPlataform.sendDoubt(userMessage);
        } else {
            aiResponse = await this.aiPlataform.sendInterviewResponse(userMessage);
        }

        const chatUserOutput = ChatUserOutput.create({
            message: aiResponse.choices[0].message.content,
        });

        await this.replyChatMessage(chatUserOutput, chatUser);
    }
}
