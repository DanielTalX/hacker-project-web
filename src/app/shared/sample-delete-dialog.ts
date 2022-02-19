import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'sample-delete-dialog',
    templateUrl: 'sample-delete-dialog.html',
})
export class SampleDeleteDialog {

    constructor(
        public dialogRef: MatDialogRef<SampleDeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {id: string, title?: string ,content?: string}) { }

    cancel(): void {
        this.dialogRef.close();
    }
}