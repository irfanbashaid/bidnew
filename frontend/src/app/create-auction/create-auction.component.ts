import { Component, OnInit } from '@angular/core';
import { GrabitService } from '../service/grabit.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {

  filepath;
  public selectedFile: any;
  public show_revert_error:boolean;
  public show_valid:boolean;
  public baseprice_error:boolean;
  public least_baseprice:number;
  public minimumbid_error:boolean;
  public reset_time_error:boolean;
  public successful_message:boolean;
  public bid_increment_error:boolean;
  public auction = [];
  public selected_aid=[];
  public selected_hash;
  public productid;
  // public successful_message:boolean;
  // public show_valid:boolean;
  // public show_revert_error:boolean;
  fd = new FormData();
  constructor (private grab:GrabitService,private http:HttpClient,private spinner:NgxSpinnerService) {
    this.show_revert_error=false;
    this.show_valid=false;
    this.baseprice_error=false;
    this.reset_time_error=false;
    this.successful_message=false;
    this.bid_increment_error=false;
  }

  onFileChanged(event){
      this.selectedFile = event.target.files[0];
  }    
  upload(productname,start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders){
    
    let ins=this;
    ins.successful_message=false;
    ins.show_revert_error=false;
    ins.show_valid=false;
    ins.baseprice_error=false;
    ins.reset_time_error=false;
    ins.minimumbid_error=false;
    ins.bid_increment_error=false;

    if(productname.trim() !="" && reg_start.trim() !="" &&reg_end.trim()!="" && start.trim() !="" && end.trim() !="" && base_price.trim() !="" && bid_increment.trim() !="" && minimum_bid.trim() !="" && reset_time.trim() !="" && minimum_bidders.trim()!="") {
      if(Number(minimum_bid)<Number(bid_increment))
      {
        
        ins.minimumbid_error=true;
        // alert("minimum bid must be greater or equal to bid increment")
        return;
      }
      if(Number(base_price)<Number(minimum_bid)+(Number(bid_increment)-(Number(minimum_bid)%Number(bid_increment))))
      {
        ins.baseprice_error=true;
        ins.least_baseprice= Number(minimum_bid)+Number(bid_increment-(minimum_bid%bid_increment))
        // alert("Base price must be atleast"+f+"")
        return;
      }
      if(Number(reset_time)<=0)
      {
        ins.reset_time_error=true;
        // alert("Reset time must be greater than 0");
        return;
      }
      if(Number(bid_increment<=0))
      {
        ins.bid_increment_error=true;
        return;
      }
        var headers = new HttpHeaders();
        let fd = new FormData(); 
        headers.append('Content-Type', 'application/form-data');
        fd.append('path', ins.selectedFile);
        
        this.http.post("https://ipfs.infura.io:5001/api/v0/add?stream-channels=true",fd).subscribe((r)=>{
        var t=new Date(start).getTime() / 1000;
        var a:any = Math.round(t);
        var _starttime:number = parseInt(a);
        var t1=new Date(end).getTime() / 1000;
        var a1:any = Math.round(t1);
        var _endtime:number = parseInt(a1);
        var t3=new Date(reg_start).getTime()/1000;
        var c:any=Math.round(t3);
        var _reg_start:number=parseInt(c);
        var t4=new Date(reg_end).getTime()/1000;
        var d:any=Math.round(t4);
        var _reg_end:number=parseInt(d);
        // ins.owner.spinner.show();
                                console.log(_reg_start+" "+_reg_end+" "+_starttime+" "+_endtime);
                                
        ins.grab.createAuction(_starttime,_endtime,base_price,bid_increment,minimum_bid,reset_time,_reg_start,_reg_end,minimum_bidders).then(res=>{
          console.log("createAuction",res);          
          // ins.owner.spinner.hide();
          if(res==1){  
            res=0;
            ins.grab.upload(r["Hash"],productname);
            ins.successful_message=true;
            (document.getElementById("productname")as HTMLInputElement).value="";
            (document.getElementById("regstarttime")as HTMLInputElement).value="";
            (document.getElementById("regendtime")as HTMLInputElement).value="";
            (document.getElementById("starttime")as HTMLInputElement).value="";
            (document.getElementById("endtime")as HTMLInputElement).value="";
            (document.getElementById("baseprice")as HTMLInputElement).value="";
            (document.getElementById("bidincrement")as HTMLInputElement).value="";
            (document.getElementById("minimumbid")as HTMLInputElement).value="";
            (document.getElementById("resettime")as HTMLInputElement).value="";
            (document.getElementById("minimumbidders")as HTMLInputElement).value="";
            (document.getElementById("fileInput")as HTMLInputElement).value="";        
            return;
          }
          else if(res==2){
            res
            console.log('Error...');
            this.show_valid=true;
          }
          else{
            this.show_valid=true;
          }
        })
       })  
    }
    else{
      
      this.show_revert_error=true;
    }
  }


  table_data(){
    let instance = this;
    instance.grab.getauctiondetails().then(ress => {  
      console.log("res",ress);
        
      ress[0].forEach(auction_id=> {
        let aid = auction_id+1;
          this.grab.canClone(aid).then(clonable=>{         
          console.log("clonable",clonable);
          if(clonable==true )
          {
            this.grab.auctionDetails(aid).then(auctionfinalize=>{
            if(auctionfinalize["status"]==1){
            this.grab.getAuctionById(aid).subscribe(res=>{
                console.log(res['productname']);
                let obj = {};
                obj['auctionId'] = aid;
                obj['productname'] =res['productname'];
                instance.selected_aid.push(obj);
              });
            }
          })
            }
          });
         });
       });     
    }
  

  setdetails(a_id){
    (document.getElementById("productname")as HTMLInputElement).value="";
    (document.getElementById("regstarttime")as HTMLInputElement).value="";
    (document.getElementById("regendtime")as HTMLInputElement).value="";
    (document.getElementById("starttime")as HTMLInputElement).value="";
    (document.getElementById("endtime")as HTMLInputElement).value="";
    (document.getElementById("baseprice")as HTMLInputElement).value="";
    (document.getElementById("bidincrement")as HTMLInputElement).value="";
    (document.getElementById("minimumbid")as HTMLInputElement).value="";
    (document.getElementById("resettime")as HTMLInputElement).value="";
    (document.getElementById("minimumbidders")as HTMLInputElement).value="";
    (document.getElementById("fileInput")as HTMLInputElement).value="";
    this.grab.auctionDetails(a_id).then(result=>{
      this.grab.getAuctionById(a_id).subscribe(res=>{
        console.log(res);
        this.selected_hash =res['ipfshash'];
        this.productid=a_id;
        (document.getElementById("productname")as HTMLInputElement).value=res['productname'];
        (document.getElementById("baseprice")as HTMLInputElement).value=result.basePrice;
        (document.getElementById("bidincrement")as HTMLInputElement).value=result.bidIncrement;
        (document.getElementById("minimumbid")as HTMLInputElement).value=result.bidBounds[0];
        (document.getElementById("resettime")as HTMLInputElement).value=result.resetTime;
        (document.getElementById("minimumbidders")as HTMLInputElement).value=result.bidBounds[1];
        (document.getElementById("productname")as HTMLInputElement).readOnly=true;
        (document.getElementById("baseprice")as HTMLInputElement).readOnly=true;
        (document.getElementById("bidincrement")as HTMLInputElement).readOnly=true;
        (document.getElementById("minimumbid")as HTMLInputElement).readOnly=true;
        (document.getElementById("resettime")as HTMLInputElement).readOnly=true;
        (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=true;
        (document.getElementById("clonebidbtn")as HTMLDivElement).style.display="block";
        (document.getElementById("newbidbtn")as HTMLDivElement).style.display="none";
        (document.getElementById("fileInputbox")as HTMLInputElement).style.display="none";
        });
      });
    }

  clone(productname,starttime,endtime,rgstarttime,rgendtime){
      let instance=this;
      instance.successful_message=false;
      instance.show_revert_error=false;
      instance.show_valid=false;
    if(productname.trim()!='' && starttime.trim()!='' && endtime.trim()!='' && rgstarttime.trim()!='' && rgendtime.trim()!='')
    {
      var t=new Date(starttime).getTime() / 1000;
      var a:any = Math.round(t);
      var _starttime:number = parseInt(a);
      var t1=new Date(endtime).getTime() / 1000;
      var a1:any = Math.round(t1);
      var _endtime:number = parseInt(a1);
      var t3=new Date(rgstarttime).getTime()/1000;
      var c:any=Math.round(t3);
      var _reg_start:number=parseInt(c);
      var t4=new Date(rgendtime).getTime()/1000;
      var d:any=Math.round(t4);
      var _reg_end:number=parseInt(d);
      instance.grab.cloneAuction(instance.productid,_starttime,_endtime,_reg_start,_reg_end).then(res=>{
        // instance.owner.spinner.hide();
        if(res==1){  
          instance.successful_message=true;
          instance.table_data();
          instance.grab.upload(instance.selected_hash,productname);
          (document.getElementById("productname")as HTMLInputElement).value="";
          (document.getElementById("starttime")as HTMLInputElement).value="";
          (document.getElementById("endtime")as HTMLInputElement).value="";
          (document.getElementById("baseprice")as HTMLInputElement).value="";
          (document.getElementById("bidincrement")as HTMLInputElement).value="";
          (document.getElementById("minimumbid")as HTMLInputElement).value="";
          (document.getElementById("resettime")as HTMLInputElement).value="";
          (document.getElementById("regstarttime")as HTMLInputElement).value="";
          (document.getElementById("regendtime")as HTMLInputElement).value="";
          (document.getElementById("minimumbidders")as HTMLInputElement).value="";
          (document.getElementById("productname")as HTMLInputElement).readOnly=false;
        (document.getElementById("baseprice")as HTMLInputElement).readOnly=false;
        (document.getElementById("bidincrement")as HTMLInputElement).readOnly=false;
        (document.getElementById("minimumbid")as HTMLInputElement).readOnly=false;
        (document.getElementById("resettime")as HTMLInputElement).readOnly=false;
        (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=false;
        (document.getElementById("clonebidbtn")as HTMLDivElement).style.display="none";
        (document.getElementById("newbidbtn")as HTMLDivElement).style.display="block";
        (document.getElementById("fileInputbox")as HTMLInputElement).style.display="block";
          return;
        }
        else if(res==2){
          res
          console.log('Error...');
          instance.show_revert_error=true;
          // this.show_valid=true;
        }
        else{
          // this.show_valid=true;
        }
      })
    }
    else{
      alert("Invalid details");
      instance.show_valid=true;
    }
      
  }

  feildClear(num){    
    (document.getElementById("productname")as HTMLInputElement).value="";
    (document.getElementById("regstarttime")as HTMLInputElement).value="";
    (document.getElementById("regendtime")as HTMLInputElement).value="";
    (document.getElementById("starttime")as HTMLInputElement).value="";
    (document.getElementById("endtime")as HTMLInputElement).value="";
    (document.getElementById("baseprice")as HTMLInputElement).value="";
    (document.getElementById("bidincrement")as HTMLInputElement).value="";
    (document.getElementById("minimumbid")as HTMLInputElement).value="";
    (document.getElementById("resettime")as HTMLInputElement).value="";
    (document.getElementById("minimumbidders")as HTMLInputElement).value="";
    (document.getElementById("fileInput")as HTMLInputElement).value="";        
    if(num==1){
        (document.getElementById("productname")as HTMLInputElement).readOnly=false;
        (document.getElementById("baseprice")as HTMLInputElement).readOnly=false;
        (document.getElementById("bidincrement")as HTMLInputElement).readOnly=false;
        (document.getElementById("minimumbid")as HTMLInputElement).readOnly=false;
        (document.getElementById("resettime")as HTMLInputElement).readOnly=false;
        (document.getElementById("minimumbidders")as HTMLInputElement).readOnly=false;
        (document.getElementById("clonebidbtn")as HTMLDivElement).style.display="none";
        (document.getElementById("newbidbtn")as HTMLDivElement).style.display="block";
        (document.getElementById("fileInputbox")as HTMLInputElement).style.display="block";
    }  
  }


  ngOnInit() 
 {  
  // this.table_data()
 }

}