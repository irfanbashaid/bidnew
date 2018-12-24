import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsComponent } from './terms/terms.component';
import { SignupComponent } from './signup/signup.component';
import { ChangeownerComponent } from './changeowner/changeowner.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { SetresultComponent } from './setresult/setresult.component';
import { SelectComponent } from './select/select.component';
import { SendcreditsComponent } from './sendcredits/sendcredits.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'contactus',
    component:ContactusComponent
  },
  {
    path:'howitworks',
    component:HowitworksComponent
  },
  {
    path:'terms',
    component:TermsComponent
  },
  {
    path:'changeowner',
    component:ChangeownerComponent
  },
  {
    path:'createAuction',
    component:CreateAuctionComponent
  },
  {
    path:'sendcredits',
    component:SendcreditsComponent
  },
  {
    path:'setresult',
    component:SetresultComponent
  },
  {
    path:'select',
    component:SelectComponent
  },
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
