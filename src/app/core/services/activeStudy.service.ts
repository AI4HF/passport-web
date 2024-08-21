import {BehaviorSubject, map, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {Study} from "../../shared/models/study.model";
import {StudyPersonnelService} from "./studyPersonnel.service";
import {catchError} from "rxjs/operators";


/**
 * Service to manage the active study of the personnel.
 */
@Injectable({
    providedIn: 'root'
})
export class ActiveStudyService {

    /**
     * Studies that related to the personnel
     */
    studies: Study[] = [];

    /**
     * Selected study by the personnel
     */
    activeStudy: BehaviorSubject<Study> = new BehaviorSubject(null);

    constructor(private studyPersonnelService: StudyPersonnelService) { }

    /**
     * Set active study
     * @param studyId Role of the user
     */
    setActiveStudy(studyId: number) {
        const study = this.studies.find((study: Study) => study.id === studyId);
        this.activeStudy.next(study);
    }

    /**
     * Fetch studies from StudyPersonnel service
     */
    fetchStudies(): Observable<Study[]> {
        return this.studyPersonnelService.getStudiesByPersonnelId()
            .pipe(
                map((response: any) =>{
                    this.studies = response.map((study: any) => new Study(study));
                    return this.studies;
                }),
                catchError((error) => {
                    console.error(error);
                    return throwError(error);
                }));
    }

    /**
     * Get active Study
     * @return {Study}
     */
    getActiveStudy(): Study {
        return this.activeStudy.getValue();
    }

    /**
     * Get study array
     * @return {Study}
     */
    getStudies(): Study[] {
        return this.studies;
    }

    /**
     * Get active Study as observable
     * @return {Observable<Study>}
     */
    getActiveStudyAsObservable(): Observable<Study> {
        return this.activeStudy.asObservable();
    }

    /**
     * Clear active Study
     */
    clearActiveStudy(){
        this.activeStudy.next(null);
    }

    /**
     * Clear study array
     */
    clearStudies(){
        this.studies = [];
    }

}