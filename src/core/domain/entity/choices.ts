import { Message } from "./message";

export type ChoicesProps = {
    index: number;
    message: Message;
    finishReason: string;
}

export class Choices {
    readonly index: number;
    readonly message: Message;
    readonly finishReason: string;

    private constructor(props: ChoicesProps) {
        Object.assign(this, props);
    }

    static create(props: ChoicesProps) {
        return new Choices(props);
    }
}
