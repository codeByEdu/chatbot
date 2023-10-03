import { AiMessage } from "./ai-message";

export type ChoicesProps = {
    index: number;
    message: AiMessage;
    finishReason: string;
}

export class Choices {
    readonly index: number;
    readonly message: AiMessage;
    readonly finishReason: string;

    private constructor(props: ChoicesProps) {
        Object.assign(this, props);
    }

    static create(props: ChoicesProps) {
        return new Choices(props);
    }
}
