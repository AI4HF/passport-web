import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';

/**
 * Class which implements Study Management Page scripts.
 */
@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.css']
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

  constructor(private apiService: ApiService) { }

  /**
   * Automatic load call which loads up the study table contents.
   */
  ngOnInit(): void {
    this.loadAllStudies();
  }

  /**
   * Load table method which sets up the table elements.
   */
  loadAllStudies(): void {
    this.apiService.getAllStudies().subscribe(
      (data: any) => {
        this.studies = data;
      },
      (error: any) => {
        console.error('Error fetching studies: ', error);
      }
    );
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
}
