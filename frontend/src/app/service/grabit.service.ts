import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Tx from 'ethereumjs-tx';
import { Buffer } from "buffer";
import { environment } from '../../environments/environment';
import { User } from '../shared/user.model';
import Web3 from "../web3.min.js";

declare let require:any;
let json = require('./grabit.json');

@Injectable({
  providedIn: 'root'
})
export class GrabitService {

  public  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  public _privateKey;
  public _grabItContractAddress: string ="0x013f3a4b98db9469dd245edbd00c8896a29d0c94"
  public _etherumAccountAddress;
  public _grabItContract: any;
  public _web3;
  public imgshow:boolean;
  public prod_zoom={};
  public isadmin:boolean;
  
  constructor(private http:HttpClient) {
    this._web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));
    this._grabItContract = new this._web3.eth.Contract(json,this._grabItContractAddress,{gaslimit:3000000});
    console.log(this._web3.version)
  }

  refresh(){
    window.onload = function () {  
      document.onkeydown = function (e) {  
          return (e.which || e.keyCode) != 116;  
      };  
  }  
  }
  check_admin(){
    let meta = this;
    meta.owner().then(owner => {
      if(meta._etherumAccountAddress==owner){
        meta.isadmin=true;
      }
    })
  }

  getUserName(public_key) { //new
    return this.http.get(environment.api + '/getUserName/'+public_key,this.noAuthHeader);
  }
 
  getAuctionById(id) { //new
    // var obj={};
    // obj["auctionid"]=id;
    return this.http.get(environment.api +'/getAuctionById/'+id,this.noAuthHeader);
  }
 
   getuserthings(){
    var token = this.getToken();
    // var to={};
    // to['token']=token;
    return this.http.get(environment.api + '/userProfile/'+token,this.noAuthHeader);
  } 
   storeselectedproduct(selected) {
    return this.http.put(environment.api +'/storeselectedproduct',selected);
  }

public async lastBidderDetails(_aID):Promise<any>{
  return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'}, function(error, result){ 
        if(!error){
           let array=[];
           result.find(function(element) {
            if(element['returnValues'].auctionID == _aID)
            {
              array.push(element)
            }
          });

          if(array.length!=0)
          {
            resolve(array[array.length-1]);
          }
        else{
          resolve('No Bid Logs Found')
        }
        }
        else{
        }
      })
  }) as Promise<any>;
 }


 
public async Particular_bid_details(_aID):Promise<any>{
  return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'}, function(error, result){ 
        if(!error){
           let array=[];
           result.find(function(element) {
            if(element['returnValues'].auctionID == _aID)
            {
              array.push(element)
            }
          });
          resolve(array)
          }
        else{
        }
      })
  }) as Promise<any>;
 }

public async event_Bidding():Promise<any>{
  return new Promise((resolve,reject)=>{
    this._grabItContract.getPastEvents('Bidding',{fromBlock:0, toBlock: 'latest'},function(error,result){
      console.log(result);      
      resolve(result);
    })  
  }) as Promise<any>;
}
   public async event_OwnershipTransferred():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('OwnershipTransferred',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_Mint():Promise<any>{
     let meta = this;
    return new Promise((resolve,reject)=>{
      meta._grabItContract.getPastEvents('Mint',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_Transfer():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('Transfer',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_AuctionFinalized():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('AuctionFinalized',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

   public async event_AuctionCreated():Promise<any>{
    return new Promise((resolve,reject)=>{
      this._grabItContract.getPastEvents('AuctionCreated',{fromBlock:0, toBlock: 'latest'},function(error,result){
        resolve(result);
      })  
    }) as Promise<any>;
   }

  postUser(user:User){
    return this.http.post(environment.api+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.api + '/authenticate', authCredentials,this.noAuthHeader);
  }

  // forgotpassword(temp1) {
  //   return this.http.put(environment.api + '/forgotpassword',temp1,this.noAuthHeader);
  // }
  forgotpassword(temp1) {
    return this.http.put(environment.api + '/forgotpassword',temp1,this.noAuthHeader);
  }
 
  public async preregister(auctionid):Promise<number>{
    let instance = this;
    return new Promise((resolve,reject)=>{
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.PreRegister(auctionid);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    })as Promise<number>;
  }
    public async ispreregistered(auctionid):Promise<number>{
      var instance = this;
      return new Promise((resolve,reject)=>{
        instance._grabItContract.methods.isPreRegistered(auctionid,this._etherumAccountAddress).call(function(error, result){
          if(error != null) {
            reject(error);
          }
          else {
            resolve(result)
          }
        });
      })as Promise<number>
    }

    
  public async getauctiondetails(): Promise<any> {   
    return new Promise((resolve, reject) => {
      {
     this.http.get(environment.api + '/productDetails').subscribe(res=>{
       let temp:any=res;
       let array=[];
       for(let a=0;a<temp.length;a++)
       {
         array.push(a);
       }
          let result=[];
          result.push(array);
          result.push(res);
         resolve(result)
       
    },err=>{
      console.log(err);
      
    });
  }
}) as Promise<any>;
  }

  public async registeredListForAuction(auctionid):Promise<string[]>{
    var instance = this;
    return new Promise((resolve,reject)=>{
      instance._grabItContract.methods.registeredListForAuction(auctionid).call(function(error, result){
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    })as Promise<string[]>
  }
  
  public async canClone(auctionid):Promise<boolean>{
    var instance = this;
    return new Promise((resolve,reject)=>{
      instance._grabItContract.methods.canClone(auctionid).call(function(error, result){
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    })as Promise<boolean>
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
 
  getToken() {
    return localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }
  
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  upload(ipfs_hash,product_name) {
    let obj={};
        obj['ipfs_hash']=ipfs_hash;
        obj['product_name']=product_name;
        this.http.post(environment.api+'/productdetailssave',obj,this.noAuthHeader)
        .subscribe(res=>{
          console.log(res)
        },err=>{
          console.log(err);
        })
  }

  
  changepassword(change){
    return this.http.put(environment.api+'/changepassword',change,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.api + '/userDetails',this.noAuthHeader);
  }

  public async setPrivateKey(privateKey): Promise<boolean> {   
    let instance = this;
    instance._privateKey=privateKey;
    return new Promise((resolve, reject) => {
      let obj;
        try{
          obj= instance._web3.eth.accounts.privateKeyToAccount('0x'+privateKey);    
        }
        catch(e)
        {
          resolve(false);
        }
        instance._etherumAccountAddress=obj["address"];
        instance.check_admin();
        resolve(true);
    }) as Promise<boolean>;
  }
  
  public async getEtherumAccountBalance(): Promise<number> {
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getBalance(instance._etherumAccountAddress,function(err,result){
        if(err != null) {
          reject(err);
        }
        else{
          resolve(instance._web3.utils.fromWei(result,'ether'));
        }
      })
    }) as Promise<number>;
  }

  public async owner(): Promise<string> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.owner().call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<string>;
  }

  public async transferOwnership(newOwner):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.transferOwnership(newOwner);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async transfer( _to,_value):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.transfer(_to,_value);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async mint( _to,_tokens):Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.mint(_to,_tokens);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async balanceOf(): Promise<number> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.balanceOf().call({from:instance._etherumAccountAddress},function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result);//instance._web3.utils.fromWei(result,'ether')
        }
      });
    }) as Promise<number>;
  }

  public async currentTime(): Promise<number> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.currentTime().call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
      // var t=new Date(Date.now()).getTime() / 1000;
      // var a:any = Math.round(t);
      // console.log(a);
      
      // resolve(a);
          
        }
      });
      
      
    }) as Promise<number>;
  }

  public async createAuction(start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.createAuction(start,end,base_price,bid_increment,minimum_bid,reset_time,reg_start,reg_end,minimum_bidders);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
            
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }


  public async cloneAuction(productid,starttime,endtime,rgstarttime,rgendtime) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.cloneAuction(productid,starttime,endtime,rgstarttime,rgendtime);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
            
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async auctionDetails(_aID): Promise<any> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.auctionDetails(_aID).call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<any>;
  }

  
  public async bidDetails(_aID): Promise<any> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.bidDetails(_aID).call({from:instance._etherumAccountAddress},function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<any>;
  }

  public async auctionList(): Promise<number[]> {                                       
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._grabItContract.methods.auctionList().call(function(error, result){  
        if(error != null) {
          reject(error);
        }
        else {
          resolve(result)
        }
      });
    }) as Promise<number[]>;
  }

  public async manualBidding(_aID,_amount) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.manualBidding(_aID,_amount);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            console.log('Hashing...');
 
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
                console.log('Deployed...');
 
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }
  public async finalizeAuction(_aID) :Promise<number>{
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance._etherumAccountAddress,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance._privateKey,'hex');
        var contract_function = instance._grabItContract.methods.finalizeAuction(_aID);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance._etherumAccountAddress,
          to: instance._grabItContractAddress,
          value:'0x0',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }

  public async hash(a): Promise<number> {
    let meta = this;
    return new Promise((resolve, reject) => {
      var accountInterval = setInterval(function()
      {
        meta._web3.eth.getTransactionReceipt(a,function(err,result){
          if(err != null) {
            resolve(0);
          }
          if(result !== null)
          {
            clearInterval(accountInterval);
            if(result.status == 0x1)
            {
              resolve(1);
            }
            else
            {           
              resolve(2);
            }
          }
        })
      },100)
    }) as Promise<number>;
  }
}

