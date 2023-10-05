import { Choices } from "./choices";
import { Usage } from "./usage";

export type AiResponseProps = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choices;
}

export class AiResponse {
    readonly id: string;
    readonly object: string;
    readonly created: number;
    readonly model: string;
    readonly choices: Choices;
    readonly usage: Usage;
    
    private constructor(props: AiResponseProps) {
        Object.assign(this, props);
    }

    static create(props: AiResponseProps) {
        return new AiResponse(props);
    }
}