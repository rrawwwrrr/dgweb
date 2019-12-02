import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { System, Env, DialogData } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-new-task-dialog',
    templateUrl: 'newtask.component.html',
    styleUrls: ['./newtask.component.css'],
})
export class NewTaskDialogComponent {
    systems: string[];
    meForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<NewTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {
        this.data = data;
        this.systems = Object.keys(data.systemsList);
        console.log(data);
        this.meForm = fb.group({
            environment: new FormControl(),
            system: new FormControl(),
            method: new FormControl(),
            // phone: new FormControl(),
            // email: new FormControl(),
            // femail: new FormControl(),
            // login: new FormControl(),
            // editpwd: new FormControl(),
            // password: new FormControl(),
            // newpassword: new FormControl(),
            // dblpassword: new FormControl(),
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    confirmSelection(): void {
        const form = this.meForm.value;
        console.log(form);
        // this.dialogRef.close(form);
    }
}
