import qrcode from "qrcode-terminal";
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { AiMessage } from '../../core/domain/entity/ai-message';
import { AiRequest } from '../../core/domain/entity/ai-request';
import { AiResponse } from '../../core/domain/entity/ai-response';
import { ChatMessageInput } from '../../core/domain/entity/chat-message-input';
import { ChatUserOutput } from '../../core/domain/entity/chat-message-output';
import { ChatUser } from '../../core/domain/entity/chat-user';
import { AiPlataform } from '../../core/domain/use-cases/ai-plataform';
import { ChatPlataform } from '../../core/domain/use-cases/chat-plataform';

export class WhatsAppChatPlataform implements ChatPlataform {
    public client: Client;
    public cacheChatUser: { userId: string, message: string, aiResponse: string }[] = [];

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

        let aiResponse: AiResponse;
        let aiRequest: AiRequest;

        const modelDuvidasEstagio = process.env.OPEN_AI_MODEL_DUVIDAS_ESTAGIO;
        const modelSimuladorEntrevista = process.env.OPEN_AI_MODEL_SIMULADOR_ENTREVISTA;

        if (aiMessage.message.includes("[DUVIDAS_ESTAGIO]")) {
            const context: AiMessage[] = [
                AiMessage.create({
                    message: "Você é um chatbot da Universidade Mackenzie que responde dúvidas relacionadas à estágios da Universidade Mackenzie, com os dados que você possui dos regulamentos da Universidade Mackenzie",
                    role: "system"
                })
            ]
            aiRequest = AiRequest.create({
                requestMessages: [...context, aiMessage]
            })
            aiResponse = await this.aiPlataform.sendPrompt(aiRequest, modelDuvidasEstagio);
        } else {
            const context: AiMessage[] = [
                AiMessage.create({ "role": "system", "message": "Simule um entrevistador de emprego e analise a resposta do usuário, fornecendo um feedback construtivo, e faça outra pergunta na sequência" }),
                AiMessage.create({ "role": "user", "message": "Quero me preparar para todos os cenários possíveis" }),
                AiMessage.create({ "role": "assistant", "message": "PERGUNTA: Há alguma situação em que você sentiu que falhou e como lidou com isso?" }),
                AiMessage.create({ "role": "user", "message": "Sim, em um projeto que não atendeu às expectativas do cliente. Refleti sobre os erros, obtive feedback e ajustei minha abordagem para projetos futuros" }),
                AiMessage.create({ "role": "assistant", "message": "FEEDBACK: Reconhecer falhas e se adaptar com base nelas é uma habilidade valiosa. Aprofundar-se em como essas mudanças impactaram positivamente os projetos subsequentes pode fortalecer sua resposta.\n PERGUNTA: Como você define e avalia o sucesso em seu trabalho?" })
            ]
            aiRequest = AiRequest.create({
                requestMessages: [...context, aiMessage]
            })
            aiResponse = await this.aiPlataform.sendPrompt(aiRequest, modelSimuladorEntrevista);
        }

        const chatUserOutput = ChatUserOutput.create({
            message: aiResponse.choices[0].message.content,
        });

        this.cacheChatUser.push({
            userId: chatUser.userId,
            message: chatInput.message,
            aiResponse: chatUserOutput.message
        })

        await this.replyChatMessage(chatUserOutput, chatUser);
    }
}
