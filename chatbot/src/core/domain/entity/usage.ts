export type UsageProps = {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export class Usage {
    readonly promptTokens: number;
    readonly completionTokens: number;
    readonly totalTokens: number;

    private constructor(props: UsageProps) {
        Object.assign(this, props);
    }

    static create(props: UsageProps) {
        return new Usage(props);
    }
}

