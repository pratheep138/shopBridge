import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from './services/data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShopBridge';
  public isLoggedIn: boolean;

  constructor(private readonly router: Router, private readonly toaster: ToastrService,
    private readonly dataServiceService: DataServiceService ) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') ? true : false;
   }

  public login(): void {
    sessionStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn = true;
    this.toaster.success('Succesfully LoggedIn');
    this.dataServiceService.sendLoginStatus(this.isLoggedIn);
  }

  public logOut(): void {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('productsList');
    this.isLoggedIn = false;
    this.toaster.success('You Have Logged Out');
    this.dataServiceService.sendLoginStatus(this.isLoggedIn);
  }

  public navigateTo(url: any): void {
    this.router.navigateByUrl(url);
  }
}
