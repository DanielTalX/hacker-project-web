import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';
import { Category } from './category';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed, void',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class CategoryListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  displayedColumns: string[] = ['categoryId', 'categoryName'];
  allDisplayedColumns: string[] = ['categoryId', 'categoryName', 'user-actions'];

  securityObject: AppUserAuth;

  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  categories: Category[] = [];
  countItems = 0;

  constructor(private categoryService: CategoryService,
    private router: Router,
    private securityService: SecurityService,
    // private dialog: MatDialog
    ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService.getCategories()
      .subscribe((categories: any[]) => {
        this.dataSource.data = categories;
        this.categories = categories;
        this.countItems = categories.length;
        this.dataSource.sort = this.sort;
      });
  }

  addCategory(): void {
    this.router.navigate(['/categoryDetail', -1]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}