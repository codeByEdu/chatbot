import { AiMessage } from "./ai-message";

export type AiRequestProps = {
    requestMessages: AiMessage[];
}

export class AiRequest {
    readonly requestMessages: AiMessage[]

    private constructor(props: AiRequestProps) {
        Object.assign(this, props);
    }

    static create(props: AiRequestProps) {
        return new AiRequest(props);
    }

    buildDoubtContext(): AiRequest {
        let context: AiMessage[] = [
            AiMessage.create({ role: "system", message: "Você é um chatbot da Universidade Mackenzie que responde dúvidas relacionadas à estágios da Universidade Mackenzie, com os dados que você possui dos regulamentos da Universidade Mackenzie" })
        ]
        return new AiRequest({
            ...this,
            requestMessages: [
                ...this.requestMessages,
                ...context
            ]
        })
    }

    buildInterviewContext(): AiRequest {
        let context: AiMessage[] = [
            AiMessage.create({ role: "system", message: "Simule um entrevistador de emprego e analise a resposta do usuário, fornecendo um feedback construtivo, e faça outra pergunta na sequência" }),
            AiMessage.create({ role: "user", message: "Quero me preparar para todos os cenários possíveis" }),
            AiMessage.create({ role: "assistant", message: "PERGUNTA: Há alguma situação em que você sentiu que falhou e como lidou com isso?" }),
            AiMessage.create({ role: "user", message: "Sim, em um projeto que não atendeu às expectativas do cliente. Refleti sobre os erros, obtive feedback e ajustei minha abordagem para projetos futuros" }),
            AiMessage.create({ role: "assistant", message: "FEEDBACK: Reconhecer falhas e se adaptar com base nelas é uma habilidade valiosa. Aprofundar-se em como essas mudanças impactaram positivamente os projetos subsequentes pode fortalecer sua resposta.\n PERGUNTA: Como você define e avalia o sucesso em seu trabalho?" }),
        ]
        return new AiRequest({
            ...this,
            requestMessages: [
                ...this.requestMessages,
                ...context
            ]
        })
    }
}