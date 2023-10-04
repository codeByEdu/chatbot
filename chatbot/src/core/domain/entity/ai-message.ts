export type AiMessageProps = {
    role: string;
    message: string;
}

export class AiMessage {
    readonly role: string;
    readonly message: string;

    private constructor(props: AiMessageProps) {
        Object.assign(this, props);
    }

    static create(props: AiMessageProps) {
        return new AiMessage(props);
    }
}