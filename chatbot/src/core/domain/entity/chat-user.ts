export type ChatUserProps = {
    chat: any;
    userId: string;
}

export class ChatUser {
    readonly chat: any;
    readonly userId: string;

    private constructor(props: ChatUserProps) {
        Object.assign(this, props);
    }

    static create(props: ChatUserProps) {
        return new ChatUser(props);
    }
}