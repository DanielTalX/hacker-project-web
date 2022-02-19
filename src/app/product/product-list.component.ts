import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Product } from './product';
import { AppUserAuth } from '../security/app-user-auth';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { SampleDeleteDialog } from '../shared/sample-delete-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
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
export class ProductListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  displayedColumns: string[] = ['productName', 'introductionDate', 'price', 'url'];
  allDisplayedColumns: string[] = ['productName', 'introductionDate', 'price', 'url', 'user-actions'];

  securityObject: AppUserAuth;

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  products: Product[] = [];
  expandedElement: Product | null = null;
  countItems = 0;

  constructor(private productService: ProductService,
    private router: Router,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _snackBar: MatSnackBar
    ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getProducts();
  }

  private getProducts(): void {
    this.productService.getProducts()
      .subscribe((products: any[]) => {
        this.dataSource.data = products;
        this.products = products;
        this.countItems = products.length;
        this.dataSource.sort = this.sort;
      });
  }

  addProduct(): void {
    this.router.navigate(['/productDetail', -1]);
  }

  // deleteProduct2(id: number): void {
  //   if (confirm("Delete this product?")) {
  //     this.productService.deleteProduct(id)
  //       .subscribe(() => this.products = this.products.filter(p => p.productId != id));
  //   }
  // }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(SampleDeleteDialog, {
      width: '500px',
      data: {id: id, title: "Delete this product?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.productService.deleteProduct(id)
          .subscribe((resp) => {
            if (resp) {
              this.products = this.products.filter(p => p.productId != id);
              this.updateTabbleUI();
              this.openSnackBar("product deleted", "ok", true);
            }else{
              this.openSnackBar("failed delete product", "ok", false);
            }
          },
          () => { // error
            this.openSnackBar("failed delete product", "ok", false);
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private updateTabbleUI() {
    this.dataSource.data = [];
    this.dataSource.data = this.products;
    this.table.renderRows();
    this.countItems = this.dataSource.data.length;
    this.changeDetectorRefs.detectChanges();
  }

  private openSnackBar(message: string, action: string, isSuccess?: boolean) {
    let color = isSuccess ? ('blue-snackbar') : ('red-snackbar');
    let durationInSeconds = 3;
    this._snackBar.open(message, action, {
      duration: durationInSeconds * 1000,
      panelClass: [color]
    });
  }

}
