import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  public _credits;
  public optionselected = 1;
  public user_name:string;
  public balance:number;
  public spinner;
  constructor(private grabit:GrabitService,private route:Router,private spin:NgxSpinnerService) { 
    this.load_credits();
    this.load_user_name();
    this.browser_btn_disable()    
    this.check_privateKey()
    this.spinner=this.spin;  
  }

  browser_btn_disable(){
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
   }

   check_privateKey(){
    if(this.grabit._privateKey==undefined || this.grabit._privateKey.length!=64){
      this.grabit.deleteToken();
      this.route.navigate(['/login'])
    }
   }

  load_credits(){
    this.grabit.balanceOf().then(res=>this.balance=res)
  }

  load_user_name(){
    let meta = this;
    meta.grabit.getuserthings().subscribe(
      res=>{
        meta.user_name = res['user']['fullName'];
      },
      err=>{

      }
    )
  }

  check(selected){
    this.optionselected = selected;
    this.grabit.imgshow=false;
  }

  onLogout(){
    this.grabit.deleteToken();
    this.route.navigate(['/login']);
  }

  ngOnInit() {
    window.onbeforeunload=function(){
      return "Sure";
      }

      let pipe=this;
setInterval(function(){
  pipe.grabit.balanceOf().then(balance=>{
    if(pipe.balance!=balance)
    {
      pipe.load_credits();
    }
  });
},100)
  }



}
