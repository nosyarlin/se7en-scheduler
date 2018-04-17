import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-view-schedules',
  templateUrl: './view-schedules.component.html',
  styleUrls: ['./view-schedules.component.css']
})
export class ViewSchedulesComponent implements OnInit {
  isAdmin : boolean = false;
  years : number[] =[]
  showScheduleList : boolean = true;
  showAddScheduleForm : boolean = false;
  schedule : Schedule = new Schedule(null,null);
  schedules : Schedule[];
  schedule_id: number;

  constructor(
    public snackBar: MatSnackBar,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private router: Router, 
    private cookieService: CookieService,
     ) { 
  }

  ngOnInit() {
    if(this.cookieService.get('pillar')==="Administrator"){
      this.isAdmin = true;
      this.populateYears();
    }
    this.getSchedules();
  }

  populateYears(){
    let today = new Date;
    let year = today.getFullYear();
    for(let i = 0; i< 5; i++){
      this.years.push(year + i);
    }
  }

  addSchedule(){
    this.scheduleService.createSchedule(this.schedule).subscribe(
      response => {
        if(JSON.parse(response).success){
          this.snackBar.open("Created schedule!", null, { duration: 1000, });  
          this.getSchedules();
        }else{
          this.snackBar.open("Something went wrong with adding schedule. Please try again later!", null, { duration: 1000, });
          console.log("create schedule client error", response);
        }
      }, 
      error =>{
        console.log("create schedule server", error);        
        this.snackBar.open("Whoops something went wrong with creating schedule!", null, { duration: 1000, });
      }, 
    );
  }

  getSchedules(){
    this.scheduleService.getSchedules()
      .subscribe(
        data => {
          this.schedules = data.body.sort(function(a,b) {
            if(a.year - b.year === 0){
              return a.trimester - b.trimester;
            } else{
              return a.year - b.year;
            }
          });
        },
        error => console.log("getSchedules error: " + error)
    );
  }

  deleteSchedule(schedule : Schedule){
    this.scheduleService.deleteSchedule(schedule).subscribe(
      response => {
        if(JSON.parse(response).success){
          this.snackBar.open("Created schedule!", null, { duration: 1000, });  
          this.getSchedules();
        }else{
          this.snackBar.open("Something went wrong with deleting schedule. Please try again later!", null, { duration: 1000, });
          console.log("delete schedule client error", response);
        }
      }, 
      error =>{
        console.log("could not trash schedule!");
        console.log(error);
        this.snackBar.open("Whoops something went wrong with deleting schedule!", null, { duration: 1000, });
      })
  }

  showSchedules() { this.showScheduleList = ! this.showScheduleList }
  showScheduleForm() { this.showAddScheduleForm = ! this.showAddScheduleForm }
  get diagnostic() { return JSON.stringify(this.schedules)};

  viewCalendar(id: number){
    this.router.navigateByUrl("/viewschedule/" + id);
  }
}
