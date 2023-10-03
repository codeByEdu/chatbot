export type AiResponseProps = {
    role: string;
    content: string;
}

export class AiResponse {
    readonly role: string;
    readonly content: string;

    private constructor(props: AiResponseProps) {
        Object.assign(this, props);
    }

    static create(props: AiResponseProps) {
        return new AiResponse(props);
    }
}