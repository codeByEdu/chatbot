import { Client, Message, LocalAuth } from 'whatsapp-web.js';
import { ChatMessageInput } from '../../core/domain/entity/chat-message-input';
import { ChatUserOutput } from '../../core/domain/entity/chat-message-output';
import { ChatUser } from '../../core/domain/entity/chat-user';
import { ChatPlataform } from '../../core/domain/use-cases/chat-plataform';
import { AiPlataform } from '../../core/domain/use-cases/ai-plataform';
import qrcode from "qrcode-terminal"
import { AiRequest } from '../../core/domain/entity/ai-request';
import { AiMessage } from '../../core/domain/entity/ai-message';

export class WhatsAppChatPlataform implements ChatPlataform {
    public client: Client;

    constructor(private readonly aiPlataform: AiPlataform) { }

    async initClient(): Promise<void> {
        this.client.initialize();
    }

    async createClient(): Promise<void> {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "mack-bot"
            })
        });
    }

    async startListening(): Promise<void> {
        this.client.on('qr', (qrCode) => {
            qrcode.generate(qrCode, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Bot inicializado!');
        });

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
        const aiMessage = AiMessage.create({
            message: chatInput.message,
            role: "user"
        })
        const aiMessageSystem = AiMessage.create({
            message: "Você é um chatbot da Universidade Mackenzie que responde dúvidas relacionadas à estágios da Universidade Mackenzie, com os dados que você possui dos regulamentos da Universidade Mackenzie",
            role: "system"
        })
        const aiRequest = AiRequest.create({
            requestMessages: [aiMessageSystem, aiMessage]
        })
        const aiResponse = await this.aiPlataform.sendPrompt(aiRequest);
        const chatUserOutput = ChatUserOutput.create({
            message: aiResponse.choices[0].message.content,
        });
        await this.replyChatMessage(chatUserOutput, chatUser);
    }
}
