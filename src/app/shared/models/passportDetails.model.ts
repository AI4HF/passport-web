import { Passport } from "./passport.model";

/**
 * Model for Passport Details Data Transfer Object (DTO)
 */
export class PassportDetailsDTO {

    passport: Passport;

    // New addition to hold all the details as JSON
    detailsJson: any;

    constructor(data: any) {

        if (!data) {
            return;
        }

        this.passport = new Passport(data.passport);
        this.detailsJson = data.detailsJson;
    }
}
