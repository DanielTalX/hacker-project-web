import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'sample-select-dialog',
    templateUrl: 'sample-select-dialog.html',
})
export class SampleSelectDialog {

    constructor(
        public dialogRef: MatDialogRef<SampleSelectDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {title?: string ,content?: string, values: any, value: any}) {}

    cancel(): void {
        this.dialogRef.close();
    }
}
