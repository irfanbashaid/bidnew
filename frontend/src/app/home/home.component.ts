import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
declare let simplyCountdown:any;
declare let $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
public carousel_array=[];
public notification:boolean;
public hash_array=[]
  constructor(private grab:GrabitService) { 
    // this.hash_array.push('QmRohq9ExTKMZUVAFFCqjPfeGdP8DTv3SWHDRLeUnWKTCU')
    // this.hash_array.push('QmS93z8tE8MHKGNv4RYvfA1ZaxNijLj7XDG6z2mfBfA3hW')
    // this.hash_array.push('QmW8FNha22kC3YC35xAExnupaqHq5M2bGoTaNiZpemmxkv')
    // this.hash_array.push('QmYnBZJZV4w9GTsohm2TEi3Api3NP8emnvqkgjARerjWSc')
    // this.hash_array.push('QmRohq9ExTKMZUVAFFCqjPfeGdP8DTv3SWHDRLeUnWKTCU')
    // this.hash_array.push('QmS93z8tE8MHKGNv4RYvfA1ZaxNijLj7XDG6z2mfBfA3hW')
    // this.hash_array.push('QmW8FNha22kC3YC35xAExnupaqHq5M2bGoTaNiZpemmxkv')
    // this.hash_array.push('QmYnBZJZV4w9GTsohm2TEi3Api3NP8emnvqkgjARerjWSc')

    // this.hash_array.forEach(hash=>{
    //   let obj={};
    //   obj['hash']=hash;
    //   obj['registered']=48;
    //   obj['required']=50
    //   obj['time']=5;
    //   this.carousel_array.push(obj);
    // })
    this.show_auctions()
  }

  show_auctions(){
    let instance = this;
    instance.grab.getauctiondetails().then(details=>{
        details[0].forEach(a=>{
          let i=a+1;
          instance.grab.auctionDetails(i).then(result=>{
            instance.grab.currentTime().then(now=>{
              if(now  < result['times'][0]){
                instance.grab.ispreregistered(i).then(state=>{
                let obj ={};
                obj['hash']=details[1][a]['ipfshash'];
                obj['required']=result['bidBounds'][1];
                obj['registered']=result['bidBounds'][3];
                obj['time']=result['times'][0];
                instance.carousel_array.push(obj);
               })
           }
          })
        })
      })
    })

    
  }



  dismiss_notification(){
  this.notification=false;
  }

  show_notification(){
  this.notification=true;
  console.log('Will show');
  
  }
  goto(){
    document.scrollingElement.scrollTop=0;
  }

  ngOnInit() {
    var d = new Date();
    console.log("loaded")
    simplyCountdown('simply-countdown-custom-2', {
        year: d.getFullYear(),
        month: d.getMonth() + 2,
        day: -24
    });
    simplyCountdown('simply-countdown-custom-1', {
      year: d.getFullYear(),
      month: d.getMonth() + 2,
      day: -23
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




  }

}
