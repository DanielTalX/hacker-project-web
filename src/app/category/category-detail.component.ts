import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  category: Category;
  originalCategory: Category;
  securityObject: AppUserAuth;

  constructor(private categoryService: CategoryService,
    private route: ActivatedRoute,
    private location: Location,
  private securityService: SecurityService) {
  this.securityObject = securityService.securityObject;
 }

  ngOnInit() {
    // Get the passed in category id
    let id = +(this.route.snapshot.paramMap.get('id') || -1);
    // Create or load a category
    this.createOrLoadCategory(id);
  }

  private createOrLoadCategory(id: number) {
    if (id == -1) {
      // Create new category object
      this.initCategory();
    }
    else {
      // Get a category from category service
      this.categoryService.getCategory(id)
        .subscribe((category: any) => {
          this.category = category;
          this.originalCategory = Object.assign({}, this.category)
        });
    }
  }

  private initCategory(): void {
    // Add a new category
    this.category = new Category();
    this.originalCategory = Object.assign({}, this.category);
  }

  saveData(): void {
    if (this.category.categoryId>0) {
      // Update category
      this.categoryService.updateCategory(this.category)
        .subscribe(category => { this.category = category },
          () => null,
          () => this.dataSaved());
    }
    else {
      // Add a category
      this.categoryService.addCategory(this.category)
        .subscribe(category => { this.category = category },
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
