import { ChatUser } from "./chat-user";

export type ChatMessageInputProps = {
    message: string;
    chatUser: ChatUser;
}

export class ChatMessageInput {
    readonly message: string;
    readonly chatUser: ChatUser;

    private constructor(props: ChatMessageInputProps) {
        Object.assign(this, props);
    }

    static create(props: ChatMessageInputProps) {
        return new ChatMessageInput(props);
    }
}