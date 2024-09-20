import {BehaviorSubject, map, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {Study} from "../../shared/models/study.model";
import {StudyPersonnelService} from "./studyPersonnel.service";
import {catchError} from "rxjs/operators";


/**
 * Service to manage the active study of the personnel, with session storage persistence.
 */
@Injectable({
    providedIn: 'root'
})
export class ActiveStudyService {

    /**
     * Studies related to the personnel
     */
    studies: Study[] = [];

    /**
     * Selected study by the personnel
     */
    activeStudy: BehaviorSubject<Study> = new BehaviorSubject(null);

    constructor(private studyPersonnelService: StudyPersonnelService) {
        // Load active study from sessionStorage, if available
        const storedStudy = sessionStorage.getItem('activeStudy');
        if (storedStudy) {
            this.activeStudy.next(JSON.parse(storedStudy));
        }
    }

    /**
     * Set active study and store it in session storage.
     * @param studyId Study ID to set as active
     */
    setActiveStudy(studyId: number) {
        const study = this.studies.find((study: Study) => study.id === studyId);
        if (study) {
            this.activeStudy.next(study);
            sessionStorage.setItem('activeStudy', JSON.stringify(study));
        }
    }

    /**
     * Fetch studies from StudyPersonnel service
     */
    fetchStudies(): Observable<Study[]> {
        return this.studyPersonnelService.getStudiesByPersonnelId()
            .pipe(
                map((response: any) => {
                    this.studies = response.map((study: any) => new Study(study));
                    return this.studies;
                }),
                catchError((error) => {
                    console.error(error);
                    return throwError(error);
                })
            );
    }

    /**
     * Get the current active study from BehaviorSubject or session storage
     * @return {Study}
     */
    getActiveStudy(): Study {
        return this.activeStudy.getValue();
    }

    /**
     * Get active study as an observable
     * @return {Observable<Study>}
     */
    getActiveStudyAsObservable(): Observable<Study> {
        return this.activeStudy.asObservable();
    }

    /**
     * Clear the active study from memory and session storage
     */
    clearActiveStudy() {
        this.activeStudy.next(null);
        sessionStorage.removeItem('activeStudy');
    }

    /**
     * Get the studies array
     * @return {Study[]}
     */
    getStudies(): Study[] {
        return this.studies;
    }

    /**
     * Clear studies array from memory
     */
    clearStudies() {
        this.studies = [];
    }
}
