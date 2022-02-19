import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'sample-add-dialog',
    templateUrl: 'sample-add-dialog.html',
})
export class SampleAddDialog {

    constructor(
        public dialogRef: MatDialogRef<SampleAddDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {title?: string ,content?: string, value: any}) {}

    cancel(): void {
        this.dialogRef.close();
    }
}
