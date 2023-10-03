export type AiMessageProps = {
    role: string;
    message: string;
}

export class AiMessage {
    readonly role: string;
    readonly message: string;
}