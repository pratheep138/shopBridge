import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from './../../../services/data-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public products: any;
  closeResult: string;
  public addNewItemForm: FormGroup;
  public itemName: any;
  public itemDesc: any;
  public itemPrice: any;
  public itemImageUrl: any;

  // Err variables
  public itemNameErr: string;
  public itemDescErr: string;
  public itemPriceErr: string;

  public subscription: Subscription;
  public isLoggedIn: boolean;

  constructor(private readonly dataServiceService: DataServiceService, private readonly modalService: NgbModal,
    private readonly formBuilder: FormBuilder, private readonly router: Router, private readonly toaster: ToastrService) { }

  ngOnInit(): void {
    this.products = sessionStorage.getItem('productsList') ? JSON.parse(sessionStorage.getItem('productsList')) : this.getProducts();
    this.subscription = this.dataServiceService.getLoginStatus().subscribe(flag => {
      this.isLoggedIn = flag;
    });
    if (!this.isLoggedIn){
      this.isLoggedIn = sessionStorage.getItem('isLoggedIn') ? true : false;
    }
  }

  public getProducts(): any {
    this.dataServiceService.getProducts('assets/data.json').subscribe(resp => {
      this.products = resp;
      sessionStorage.setItem('productsList', JSON.stringify(resp));
    }, (err) => {
      this.toaster.error(err);
    });
  }

  open(content): void {
    if (this.isLoggedIn){
      this.createForm();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.toaster.error('Please Login to add a new item');
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private createForm(): void{
    this.addNewItemForm = this.formBuilder.group({
      itemName: ['', Validators.compose([Validators.required])],
      itemDesc: ['', Validators.compose([Validators.required])],
      itemPrice: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
    });
  }

  public formSubmit(): void{
    const prodOjb = {
      id: this.products.length,
      name: this.addNewItemForm.controls.itemName.value,
      description: this.addNewItemForm.controls.itemDesc.value,
      price: this.addNewItemForm.controls.itemPrice.value,
      imageUrl: 'assets/images/No-image-available.png'
    };
    this.products.push(prodOjb);
    sessionStorage.setItem('productsList', JSON.stringify(this.products));
    this.modalService.dismissAll();
  }

  public showErrMsg(formgrp: any, type: string): void{
    if (type === 'itemName'){
      const formErr = formgrp && formgrp.controls && formgrp.controls.itemName && formgrp.controls.itemName.errors;
      const formTouched = formgrp && formgrp.controls && formgrp.controls.itemName && formgrp.controls.itemName.touched;
      if (formTouched && formErr){
        if (formTouched && formErr){
          this.itemNameErr = 'Enter the Name';
        }
      } else {
        this.itemNameErr = '';
      }
    } else if (type === 'itemDesc'){
      const formErr = formgrp && formgrp.controls && formgrp.controls.itemDesc && formgrp.controls.itemDesc.errors;
      const formTouched = formgrp && formgrp.controls && formgrp.controls.itemDesc && formgrp.controls.itemDesc.touched;
      if (formTouched && formErr){
        if (formErr.required){
          this.itemDescErr = 'Enter the Description';
        }
      } else {
        this.itemDescErr = '';
      }
    } else if (type === 'itemPrice'){
      const formErr = formgrp && formgrp.controls && formgrp.controls.itemPrice && formgrp.controls.itemPrice.errors;
      const formTouched = formgrp && formgrp.controls && formgrp.controls.itemPrice && formgrp.controls.itemPrice.dirty;
      if (formTouched && formErr){
        if (formErr.required){
          this.itemPriceErr = 'Enter the Price';
        }
        else if (formErr.pattern){
          this.itemPriceErr = 'Please enter numbers only';
        }
      } else {
        this.itemPriceErr = '';
      }
    }
  }

  public deleteItem(item: any): void{
    if (this.isLoggedIn){
      const newArr = [];
      this.products.forEach(element => {
        if (element.id !== item.id){
          newArr.push(element);
        }
      });
      this.products = newArr;
      sessionStorage.setItem('productsList', JSON.stringify(this.products));
    } else {
      this.toaster.error('Please Login to make changes');
    }
  }

  public navigateTo(id: string): void {
    this.router.navigateByUrl('/details/' + id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
