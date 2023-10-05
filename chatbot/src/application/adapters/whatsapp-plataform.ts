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

    // {
    //     userId: "bia",
    //     message: "posso arrumar um estagio?",
    //     when: "2021-07-28T21:00:00",
    //     aiResponse: "não sei"            
    // }

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

            const chatUserCountCache = this.cacheChatUser.filter((cache) => {
                return cache.userId == chatUser.userId;
            }).length

            if (chatUserCountCache > 20) {
                this.cacheChatUser = this.cacheChatUser.filter((cache) => cache.userId != chatUser.userId)
            }

            if (chatUserCountCache == 0) {
                this.cacheChatUser.push({
                    userId: chatUser.userId,
                    message: chatMessageProps.message,
                    aiResponse: ""
                })
            }

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

        let chatContext: AiMessage[] = [];

        if (this.cacheChatUser.length > 0) {
            this.cacheChatUser.forEach((cache) => {
                if (cache.userId == chatUser.userId && cache.aiResponse) {
                    const aiMessageSystem = AiMessage.create({
                        message: cache.aiResponse ?? "",
                        role: "system"
                    })
                    const aiMessageUser = AiMessage.create({
                        message: "contexto da conversa: " + cache.message ?? "",
                        role: "system"
                    })
                    chatContext.push(aiMessageUser)
                    chatContext.push(aiMessageSystem)
                }
            });
        }

        console.log(this.cacheChatUser)

        if (aiMessage.message.includes("[SIMULADOR_ENTREVISTA]")) {
            const aiMessageUserContext: AiMessage = AiMessage.create({
                message: 'Faça uma pergunta aleatória que apareceria em uma entrevista de estágio',
                role: 'system'
            })
            aiRequest = AiRequest.create({
                requestMessages: [aiMessageUserContext, aiMessage, ...chatContext]
            })
            aiResponse = await this.aiPlataform.sendPrompt(aiRequest, modelSimuladorEntrevista);
        } else if (aiMessage.message.includes("[DUVIDAS_ESTAGIO]")) {
            const aiMessageSystem = AiMessage.create({
                message: "Você é um simulador de entrevistas de estágios, e fará 10 perguntas ao entrevistado, porém, a cada resposta que o usuário der, dê um feedback construtivo sobre sua resposta e uma crie uma nova pergunta.",
                role: "system"
            })
            aiRequest = AiRequest.create({
                requestMessages: [aiMessageSystem, aiMessage, ...chatContext]
            })
            aiResponse = await this.aiPlataform.sendPrompt(aiRequest, modelDuvidasEstagio);
        } else {
            const aiMessageSystem = AiMessage.create({
                message: "Você é um chatbot da Universidade Mackenzie que responde dúvidas relacionadas à estágios da Universidade Mackenzie, com os dados que você possui dos regulamentos da Universidade Mackenzie",
                role: "system"
            })
            aiRequest = AiRequest.create({
                requestMessages: [aiMessage, aiMessageSystem, ...chatContext]
            })
            aiResponse = await this.aiPlataform.sendPrompt(aiRequest);
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
