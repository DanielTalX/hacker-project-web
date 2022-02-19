import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Input, Output, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { DetailsRow } from './PasswordMeter';

@Component({
  selector: 'app-password-table',
  templateUrl: './password-table.component.html',
  styleUrls: ['./password-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordTableComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  displayedColumns: string[] = ['description', 'type', 'rate', 'count', 'bonus'];
  allDisplayedColumns: string[] = ['legend', 'description', 'type', 'rate', 'count', 'bonus'];

  dataSource: MatTableDataSource<DetailsRow> = new MatTableDataSource<DetailsRow>();
  @Input() password: string = "";
  @Input() detailsRows: DetailsRow[] | null = [];
  @Input() passwordStrength: number = 0;
  @Input() complexity: string = "";

  // #FF7043, #FFA726, #FFCA28, #FFEE58, #C6FF00, #64DD17, #00C853
  color: ThemePalette = 'accent';

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource.data = [];
  }

  ngOnInit() { 
    console.log("PasswordTableComponent - ngOnInit");
    this.dataSource = new MatTableDataSource<DetailsRow>();
    this.dataSource.data = [];
    this.updateTabbleUI();
  }

  getColorComplexity(): void {
    /*switch (this.complexity) {
      case 'Too Short': this.color = "#FF7043"; break;
      case 'Very Weak': this.color = "#FFCA28"; break;
      case 'Weak': this.color = "#FFEE58"; break;
      case 'Good': this.color = "#C6FF00"; break;
      case 'Strong': this.color = "#64DD17"; break;
      case 'Very Strong': this.color = "#00C853"; break;
      default: this.color = "#FF7043"; break;
    }*/
    if (this.passwordStrength<33) this.color = 'accent';
    else if (this.passwordStrength<60) this.color = 'warn';
    else this.color = 'primary';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.password.previousValue != undefined &&
      changes.password.currentValue != changes.password.previousValue) {
      this.updateTabbleUI();
    }
  }

  private updateTabbleUI() {
    if (this.table) {
      this.getColorComplexity();
      this.dataSource.data = [];
      this.dataSource.data = this.detailsRows || [];
      // this.table.renderRows();
      this.changeDetectorRefs.detectChanges();
    }
  }


}
