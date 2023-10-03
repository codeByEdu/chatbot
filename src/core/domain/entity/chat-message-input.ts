export type ChatMessageInputProps = {
    message: string;
}

export class ChatMessageInput {
    readonly message: string;

    private constructor(props: ChatMessageInputProps) {
        Object.assign(this, props);
    }

    static create(props: ChatMessageInputProps) {
        return new ChatMessageInput(props);
    }
}