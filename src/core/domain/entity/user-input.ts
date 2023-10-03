export type UserInputProps = {
    role: string;
    content: string;
}

export class UserInput {
    readonly role: string;
    readonly content: string;

    private constructor(props: UserInputProps) {
        Object.assign(this, props);
    }

    static create(props: UserInputProps) {
        return new UserInput(props);
    }
}