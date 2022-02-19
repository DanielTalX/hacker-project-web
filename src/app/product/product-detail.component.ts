import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { ProductService } from "./product.service";
import { Product } from './product';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  originalProduct: Product;
  categories: Category[];
  securityObject: AppUserAuth;

  constructor(private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private location: Location,
  private securityService: SecurityService) {
  this.securityObject = securityService.securityObject;
 }

  ngOnInit() {
    this.getCategories();
  }

  private createOrLoadProduct(id: number) {
    if (id == -1) {
      // Create new product object
      this.initProduct();
    }
    else {
      // Get a product from product service
      this.productService.getProduct(id)
        .subscribe((product: any) => {
          this.product = product;
          this.originalProduct = Object.assign({}, this.product)
        });
    }
  }

  private initProduct(): void {
    // Add a new product
    this.product = new Product({
      introductionDate: new Date(),
      price: 1,
      url: "www.fairwaytech.com",
      categoryId: this.categories[0]?.categoryId || 0
    });
    this.originalProduct = Object.assign({}, this.product);
  }

  private getCategories() {
    this.categoryService.getCategories()
      .subscribe(categories => {
        this.categories = categories;
        // Get the passed in product id
        let id = +(this.route.snapshot.paramMap.get('id') || -1);
        // Create or load a product
        this.createOrLoadProduct(id);
      });
  }

  saveData(): void {
    this.product.categoryId = +this.product.categoryId;
    console.log("this.product = ", this.product);
    if (this.product.productId) {
      // Update product
      this.productService.updateProduct(this.product)
        .subscribe(product => { this.product = product },
          () => null,
          () => this.dataSaved());
    }
    else {
      // Add a product
      this.productService.addProduct(this.product)
        .subscribe(product => { this.product = product },
          () => null,
          () => this.dataSaved());
    }
  }

  private dataSaved(): void {
    // Redirect back to list
    this.goBack();
  }

  goBack(): void {
    this.location.back();
  }

  cancel(): void {
    this.goBack();
  }
}