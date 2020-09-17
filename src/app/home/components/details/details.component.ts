import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from './../../../services/data-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public productDetails: any;

  constructor(private readonly dataServiceService: DataServiceService, private readonly activatedRoute: ActivatedRoute,
    private readonly toaster: ToastrService) { }

  ngOnInit(): void {
    let productId = '';
    this.activatedRoute.params.subscribe(params => {
      productId = params['id'];
    });
    this.getProducts(productId[0]);
  }

  public getProducts(productId: string): any {
    if (sessionStorage.getItem('productsList')){
      let prodList: any;
      prodList = JSON.parse(sessionStorage.getItem('productsList'));
      const filterResult = prodList.filter(obj => obj.id === Number(productId));
      this.productDetails = filterResult[0];
    } else {
      this.dataServiceService.getProducts('assets/data.json').subscribe(resp => {
        const filterResult = resp.filter(obj => obj.id === Number(productId));
        this.productDetails = filterResult[0];
      }, (err) => {
        this.toaster.error(err);
      });
    }
  }

}
