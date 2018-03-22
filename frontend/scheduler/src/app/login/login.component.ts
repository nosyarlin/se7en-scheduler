import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { MatDialogRef,MatSnackBar } from '@angular/material';
import { UserService } from './../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  user: User;
  model: User = new User(null,null);
  returnURL: string;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
    ) {}

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
  }

  login(){
    this.userService.postLogin(this.model.email, this.model.password)
      .subscribe(response => {
        console.log(response);

        if(JSON.parse(response).success){
          console.log("success in loggin in");
          let id = JSON.parse(response).id;
          let pillar = JSON.parse(response).pillar;
          let email = JSON.parse(response).email;
          let name = JSON.parse(response).name;
          let phone = JSON.parse(response).phone;
          let schedules = JSON.parse(response).schedules;
          let courses = JSON.parse(response).courses;

          let set :boolean = this.userService.setUser(new User(email, this.user.password, pillar, name, phone, id, schedules, courses));
         
          if (set){
            this.router.navigateByUrl('/home');  
          }
          
        }
        else{
          this.snackBar.open("Please enter a valid password/username", null, { duration: 500, });
        }
      },
      error => {console.log("show error: "+ error),this.snackBar.open("Try clearing your cookies......", null, { duration: 500, })},
      );
  }

}

