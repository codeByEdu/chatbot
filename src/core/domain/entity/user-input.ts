export type UserInputProps = {
    message: string;
}

export class UserInput {
    readonly message: string;

    private constructor(props: UserInputProps) {
        Object.assign(this, props);
    }

    static create(props: UserInputProps) {
        return new UserInput(props);
    }
}