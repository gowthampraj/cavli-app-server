import bcryptjs from 'bcryptjs';

export class PasswordGenerator {

    private readonly _password: string;
    constructor(password: string) {
        this._password = password;
    }

    async generate(): Promise<string> {
        try {
            return await bcryptjs.hash(this._password, 1);
        } catch (error) {
            throw new Error("Error generating password");
        }
    }

    async compare(passwordHash: string): Promise<boolean> {
        try {
            return await bcryptjs.compare(this._password, passwordHash);
        } catch (error) {
            throw new Error("Error comparing password");
        }
    }
}