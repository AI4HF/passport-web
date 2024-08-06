import { Passport } from "./passport.model";

/**
 * Model representing a passport with an additional model name.
 */
export class PassportWithModelName {
    /**
     * The passport object.
     */
    passport: Passport;

    /**
     * The name of the model associated with this passport.
     */
    modelName: string;

    constructor(passport: Passport, modelName: string) {
        if (!passport) {
            return;
        }
        this.passport = new Passport(passport);
        this.modelName = modelName || '';
    }
}
