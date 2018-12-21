import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsComponent } from './terms/terms.component';
import { OwnerComponent } from './owner/owner.component';
import { SignupComponent } from './signup/signup.component';

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
    path:'owner',
    component:OwnerComponent
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
