import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Schedule } from './../../models/schedule.model';
import { Course } from './../../models/course.model';
import { ScheduleService } from './../services/schedule.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.css']
})
export class ScheduleDetailsComponent implements OnInit {
  @Input() schedule: Schedule;
  schedule_id : number;
  generated : boolean;
  courseIDs : string[] = [];
  courses: Course[] = [];
  showCourseList : boolean = true;
  showEventForm : boolean = false;
  showCourseForm : boolean = false;

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute, 
    public snackBar: MatSnackBar, 
    ) { 
    this.schedule_id = route.snapshot.params['schedule_id'];
  }

  ngOnInit() {
    this.refreshCourses();
    // this.generated = this.scheduleService.getGeneratedStatus(this.schedule_id);
    this.generated = true; // for testing
  }

  refreshCourses($event?){
    this.getCourses(this.schedule_id);
  }

  // get the metadata of this specific schedule
  getCourses(id: number){
    this.scheduleService.getCoursesInSchedule(id)
    .subscribe( 
      response => {
        if(response.status == 200){
          let array : Course[] = response.body;
          this.courses = array;
        }else{
          console.log("error getting courses for schedule:"); 
          console.log(response);
        }
        
      },
      error => { console.log("error getting courses for schedule:"); 
      console.log(error);}
    )
  }

  deleteCourse(courseId: number){
    let errorMessage : string = "There's some problem deleting this course. Please try again later!";
    this.scheduleService.deleteCourse(courseId, this.schedule_id)
      .subscribe(response => {
        if (JSON.parse(response).success){
          this.snackBar.open("Course deleted!", null, {duration: 1000, });
          this.refreshCourses();
        }else{
          this.snackBar.open(errorMessage, null, {duration: 1000, });
          console.log(response);
        }
      },
      error => {
        this.snackBar.open(errorMessage, null, {duration: 1000, });
        console.log(error);
      } 
    );
    this.refreshCourses();
  }

  showListOfCourses(){ this.showCourseList = !this.showCourseList; }
  showAddEventForm(){ this.showEventForm = !this.showEventForm; }
  showAddCourseForm(){ this.showCourseForm = !this.showCourseForm; }

}
