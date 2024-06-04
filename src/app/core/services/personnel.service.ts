import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Personnel} from "../../shared/models/personnel.model";

@Injectable({
    providedIn: 'root'
})
export class PersonnelService {

    //TODO: Remove placeholder array after connecting backend
    private personnelList = [
        {
            personId: 1,
            organizationId: 1,
            firstName: "Okan",
            lastName: "Mercan",
            role: "Data Scientist",
            email: "test@testpersonnel.com"
        },
        {
            personId: 2,
            organizationId: 2,
            firstName: "Kerem",
            lastName: "Yilmaz",
            role: "Study Owner",
            email: "test2@testpersonnel.com"
        }
    ]

    constructor(private http: HttpClient) {
    }

    getPersonnelList() {
        return of(this.personnelList)
            .pipe(map(response => response.map((item: any) => new Personnel(item))));
    }

    getPersonnelById(id: number) {
        return of(this.personnelList.find(personnel => personnel.personId === id)).pipe(map(
            response => new Personnel(response)));
    }

    updatePersonnel(personnel: Personnel){
        this.personnelList.forEach(personnelElement => {
            if(personnelElement.personId === personnel.personId){
                personnelElement.organizationId = personnel.organizationId;
                personnelElement.firstName = personnel.firstName;
                personnelElement.lastName = personnel.lastName;
                personnelElement.role = personnel.role;
                personnelElement.email = personnel.email;
            }
        });
    }

    deletePersonnel(id: number){
        this.personnelList = this.personnelList.filter(personnel => personnel.personId !== id);
    }

    createPersonnel(personnel: Personnel){
        personnel.personId = this.personnelList.at(-1).personId + 1;
        this.personnelList.push(personnel);
    }
}