export type ChatUserProps = {
    userId: string;
    userTelNumber: string;
}

export class ChatUser {
    readonly userId: string;
    readonly userTelNumber: string;

    private constructor(props: ChatUserProps) {
        Object.assign(this, props);
    }

    static create(props: ChatUserProps) {
        return new ChatUser(props);
    }
}