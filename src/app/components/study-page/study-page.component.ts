import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';

/**
 * Class which implements Study Management Page scripts.
 */
@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.scss']
})
export class StudyPageComponent implements OnInit {
  /**
   * Variable which holds all the contents of the current study table.
   */
  studies: any[] = [];

  /**
   * Variable which holds the currently chosen studies from the table, to be able to access their ids and delete them.
   */
  selectedStudies: any[] = [];

  currentPage: number = 0;

  nextPageAvailability: boolean = true;

  constructor(private apiService: ApiService) { }

  /**
   * Automatic load call which loads up the study table contents.
   */
  ngOnInit(): void {
    this.loadStudiesByPage(this.currentPage);
  }

  /**
   * Load table method which sets up the table elements.
   */
  loadStudiesByPage(page: number): void {
    this.apiService.getAllStudies(page).subscribe(
      (data: any) => {
        this.studies = data;
      },
      (error: any) => {
        console.error('Error fetching studies: ', error);
      }
    );
    this.apiService.getAllStudies(page+1).subscribe(
      (data: any) => {
        if(data.length == 0) this.nextPageAvailability = false;
        else{this.nextPageAvailability = true};
      },
      (error: any) => {
        console.error('Error fetching studies: ', error);
      }
    )
  }

  /**
   * Study selection logic which prepares the table for deletion or other operations on certain items.
   * @param study Selected study data.
   */
  selectStudy(study: any): void {
    const index = this.selectedStudies.findIndex(s => s.id === study.id);
    if (index === -1) {
      this.selectedStudies.push(study);
    } else {
      this.selectedStudies.splice(index, 1);
    }
  }

  /**
   * Deletion method which deletes all the studies selected in the table.
   */
  deleteSelectedStudies(): void {
    if (confirm('Are you sure you want to delete selected studies?')) {
      this.selectedStudies.forEach(study => {
        this.apiService.deleteStudy(study.id).subscribe(
          () => {
            this.studies = this.studies.filter(s => s.id !== study.id);
          },
          (error: any) => {
            console.error(`Error deleting study with ID ${study.id}: `, error);
          }
        );
      });
      this.selectedStudies = [];
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadStudiesByPage(this.currentPage);
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    this.loadStudiesByPage(this.currentPage);
  }
}
