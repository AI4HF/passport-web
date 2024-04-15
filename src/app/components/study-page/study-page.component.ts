import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.css']
})
export class StudyPageComponent implements OnInit {
  studies: any[] = [];
  selectedStudies: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAllStudies();
  }

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

  selectStudy(study: any): void {
    const index = this.selectedStudies.findIndex(s => s.id === study.id);
    if (index === -1) {
      this.selectedStudies.push(study);
    } else {
      this.selectedStudies.splice(index, 1);
    }
  }

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
