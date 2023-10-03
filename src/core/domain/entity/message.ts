export type MessageProps = {
    role: string;
    content: string;
}

export class Message {
    readonly role: string;
    readonly content: string;

    private constructor(props: MessageProps) {
        Object.assign(this, props);
    }

    static create(props: MessageProps) {
        return new Message(props);
    }
}
