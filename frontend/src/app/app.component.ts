import { Component } from '@angular/core';
import { GrabitService } from './service/grabit.service';
import { Router } from '@angular/router';
declare let $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Grraabit';
  error_message:string='Fill all the details correctly.';
  notification:boolean;
  user:boolean=true;
  owner:boolean;
  _web3:any;
  constructor(private grab:GrabitService,private route:Router) { 
  }

hideURLbar() {
  window.scrollTo(0, 1);
}

goto(){
  document.scrollingElement.scrollTop=0;
}
show_notification(){
  this.notification=true;
}
dismiss_notification(){
  this.notification=false;
}

login(){
  let email=(document.getElementById('email') as HTMLInputElement).value;
  let passwd=(document.getElementById('password') as HTMLInputElement).value;
  let prikey=(document.getElementById('privatekey') as HTMLInputElement).value;
  if(email.trim()!='' || passwd.trim()!='' ||  prikey.trim()!='')
  {
    let _detail:any={};
    _detail['email']=email;
    _detail['password']=passwd;
    _detail['publickey']=prikey;
    let access = this;
    access.grab.setPrivateKey(prikey).then(res=>{
      _detail['publickey']=access.grab._etherumAccountAddress;
      if(res==true){
          console.log(_detail);
          
        access.grab.login(_detail).subscribe(
          res => {           
            access.grab.setToken(res['token']);
            access.grab.owner().then(owneraddress=>{
              if(owneraddress==access.grab._etherumAccountAddress){
                access.close_toggle()
                access.owner=true;
                access.user=false;
                access.route.navigate(['/owner']);
                console.log('owner');
                
              }
              else{
                access.close_toggle();
                access.user=true;
                access.owner=false;
                access.route.navigate(['/user']);
                console.log('user');
                
              }
            }),
            (document.getElementById("email")as HTMLInputElement).value="";
            (document.getElementById("password")as HTMLInputElement).value="";
            (document.getElementById("privatekey")as HTMLInputElement).value="";
          },
          err => {   
            console.log(err);
            
            this.error_message='Invalid Credentials';
            this.show_notification();     
          }
        );
      }
      else if(res== false){
        this.error_message='User Not Found';

        this.show_notification();
      }
    }) 
    return false;
  }
  else{
    // this.validation_error=true;
    this.show_notification();
  }   
  }

close_toggle(){
  $(".button-log a").toggleClass('btn-open').toggleClass('btn-close');
  $(".overlay-login").fadeToggle(1);
    // this.open = false;
// });
}

clear_fields(){
  (document.getElementById('email') as HTMLInputElement).value='';
  (document.getElementById('password') as HTMLInputElement).value='';
  (document.getElementById('privatekey') as HTMLInputElement).value='';
}

ngOnInit() {  
  $(document).ready(function() {
      $(".btn-open").click(function() {
          $(".overlay-login").fadeToggle(200);
          $(this).toggleClass('btn-open').toggleClass('btn-close');
          return false; 
      });
  });
  $('.overlay-close1').on('click', function() {
      $(".overlay-login").fadeToggle(200);
      $(".button-log a").toggleClass('btn-open').toggleClass('btn-close');
      this.open = false;
  });

  $(document).ready(function() {
      $('.owl-carousel').owlCarousel({
          loop: true,
          margin: 10,
          responsiveClass: true,
          responsive: {
              0: {
                  items: 1,
                  nav: true
              },
              600: {
                  items: 2,
                  nav: false
              },
              900: {
                  items: 3,
                  nav: false
              },
              1000: {
                  items: 4,
                  nav: true,
                  loop: false,
                  margin: 20
              }
          }
      })
  })

  $(document).ready(function() {
      $(".dropdown").hover(
          function() {
              $('.dropdown-menu', this).stop(true, true).slideDown("fast");
              $(this).toggleClass('open');
          },
          function() {
              $('.dropdown-menu', this).stop(true, true).slideUp("fast");
              $(this).toggleClass('open');
          }
      );
  });

  $(document).ready(function($) {
      $(".scroll").click(function(event) {
          event.preventDefault();
          $('html,body').animate({
              scrollTop: $(this.hash).offset().top
          }, 900);
      });
  });

  $(document).ready(function() {
      /*
                  var defaults = {
                      containerID: 'toTop', // fading element id
                    containerHoverID: 'toTopHover', // fading element hover id
                    scrollSpeed: 1200,
                    easingType: 'linear' 
                    };
                  */

      $().UItoTop({
          easingType: 'easeOutQuart'
      });

  });
}

}