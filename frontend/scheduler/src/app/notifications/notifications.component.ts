import { Component, OnInit } from '@angular/core';
import { Announcement } from './../../models/announcement.model';
import { UserService } from './../services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  announcements : Announcement[] = [];
  
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    ) { 
  }

  ngOnInit() {
    this.refreshAnnouncements();
  }

  refreshAnnouncements(){
    this.userService.getAnnouncements()
    .map((data: any) => {
      this.announcements = data.body;
    } )
    .subscribe(
      response => {
        // this.announcements = response.body;
      }, 
      error => {
        console.log("Server error getting announcements");
        console.log(error)
      }
    )
  }

  deleteAnnouncement(id: number){
    let errorMsg = "Something went wrong with deleting announcement, please try again later.";
    this.userService.deleteAnnouncement(id).subscribe(
      response => {
        if(JSON.parse(response).success){
          this.snackBar.open("Announcement deleted!", null, {duration: 3000});
          this.refreshAnnouncements();
        }else{
          this.snackBar.open(errorMsg, null, {duration: 3000});
          console.log(response);
        }
      }, 
      error => {
        this.snackBar.open(errorMsg, null, {duration: 3000});
        console.log("Server error deleting announcements");
        console.log(error);
      }
    )
  }
}
