import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsComponent } from './terms/terms.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { ChangeownerComponent } from './changeowner/changeowner.component';
import { SelectComponent } from './select/select.component';
import { SendcreditsComponent } from './sendcredits/sendcredits.component';
import { SetresultComponent } from './setresult/setresult.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactusComponent,
    SignupComponent,
    HowitworksComponent,
    TermsComponent,
    SignupComponent,
    CreateAuctionComponent,
    ChangeownerComponent,
    SelectComponent,
    SendcreditsComponent,
    SetresultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
