export type AiRequestProps = {
    role: string;
    content: string;
}

export class AiRequest {
    readonly role: string;
    readonly content: string;

    private constructor(props: AiRequestProps) {
        Object.assign(this, props);
    }

    static create(props: AiRequestProps) {
        return new AiRequest(props);
    }
}