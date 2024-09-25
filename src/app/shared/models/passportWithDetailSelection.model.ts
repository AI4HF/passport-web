import {Passport} from "./passport.model";
import {PassportDetailsSelection} from "./passportDetailsSelection.model";

/**
 * Model for passport with details selection
 */
export class PassportWithDetailSelection {

    /**
     * The passport
     */
    passport: Passport;

    /**
     * The selected details of the passport
     */
    passportDetailsSelection: PassportDetailsSelection;


    constructor(data: any) {

        if(!data){
            return;
        }

        this.passport = data.passport;
        this.passportDetailsSelection = data.passportDetailsSelection;

    }
}