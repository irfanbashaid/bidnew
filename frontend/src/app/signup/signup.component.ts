import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public _web3;
  public account_address;
  public private_key;
  public signupnotify:number = 0;
  public prikeynotify:boolean =false;
  public formerror:string='';

  constructor(private grabit:GrabitService) {
    let meta = this;
    meta._web3=meta.grabit._web3;
  }
  
  alertClose(){
    let meta = this;
    meta.signupnotify = 0;
  }

  create(){
    let meta = this;
    let object=meta._web3.eth.accounts.create();
    meta.account_address=object['address'];
    meta.private_key=object['privateKey'].substring(2); 
    (document.getElementById('privatekey') as HTMLInputElement).type = "text";
    (document.getElementById('privatekey') as HTMLInputElement).readOnly=true;
    (document.getElementById('privatekey') as HTMLInputElement).value = meta.private_key;
    console.log(meta.private_key);
    meta.prikeynotify = true;
  }

  switchClick(){
    let meta = this;
    meta.prikeynotify = false;
    let isChecked = (document.getElementById('newtoethswitch') as HTMLInputElement).checked;
    
    if(isChecked){
      meta.create();
    }
    else{
      meta.account_address = '';
      meta.private_key = '';
      (document.getElementById('privatekey') as HTMLInputElement).value = '';
      (document.getElementById('privatekey') as HTMLInputElement).readOnly=false;
      (document.getElementById('privatekey') as HTMLInputElement).type = "password";
    }
  }

  signup(username,email,password1,password2,privatekey){
    let meta = this;
    meta.formerror = '';
    meta.signupnotify = 0;
    if(username.trim()==''||email.trim()==''||password1.trim()==''||password2.trim()==''||privatekey.trim()==''||privatekey.trim().length!=64){
      meta.formerror = 'Please Fill all the Details Correctly';
      return;
    }
    else if(password1.trim() != password2.trim()){
      meta.formerror = 'Password Miss Match';
      return;
    }
    else if(!(document.getElementById('checkboxid') as HTMLInputElement).checked){
      meta.formerror = 'Please Tick The Check Box';
      return;
    }
    let detail={};
    let obj = meta._web3.eth.accounts.privateKeyToAccount('0x'+privatekey);
    detail['fullName']=username;
    detail['email']=email;
    detail['password']=password1;
    console.log(obj["address"]);
    detail['publickey']=obj["address"];
    let user:any =detail;
    console.log(user);
    meta.grabit.postUser(user).subscribe(res=>{
        meta.fieldempty();
        document.documentElement.scrollTop = 0;
        meta.signupnotify= 1;
      },
      err=>{
        meta.fieldempty();
        meta.signupnotify= 2;
      }
    );
  }
  fieldempty(){
    let meta = this;
    meta.account_address='';
    meta.private_key='';
    meta.prikeynotify =false;
    meta.formerror='';
    (document.getElementById('privatekey') as HTMLInputElement).value = '';
    (document.getElementById('privatekey') as HTMLInputElement).readOnly=false;
    (document.getElementById('privatekey') as HTMLInputElement).type = "password";
    (document.getElementById('newtoethswitch') as HTMLInputElement).checked = false;
    (document.getElementById('checkboxid') as HTMLInputElement).checked = false;
    (document.getElementById('username') as HTMLInputElement).value = '';
    (document.getElementById('email') as HTMLInputElement).value = '';
    (document.getElementById('password1') as HTMLInputElement).value = '';
    (document.getElementById('password2') as HTMLInputElement).value = '';
  }
  ngOnInit() {
    window.onbeforeunload=function(){
      return "Sure";
    }    
  }

}
