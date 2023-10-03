export type ChatUserOutputProps = {
    message: string;
}

export class ChatUserOutput {
    readonly message: string;

    private constructor(props: ChatUserOutputProps) {
        Object.assign(this, props);
    }

    static create(props: ChatUserOutputProps) {
        return new ChatUserOutput(props);
    }
}