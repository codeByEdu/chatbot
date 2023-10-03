import { AiMessage } from "./ai-message";

export type AiRequestProps = {
    model: string;
    requestMessages: AiMessage;
}

export class AiRequest {
    readonly model: string;
    readonly requestMessages: AiMessage[]

    private constructor(props: AiRequestProps) {
        Object.assign(this, props);
    }

    static create(props: AiRequestProps) {
        return new AiRequest(props);
    }
}