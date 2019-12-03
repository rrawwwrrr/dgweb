import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { System, Env, DialogData } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'app-new-task-dialog',
    templateUrl: 'newtask.component.html',
    styleUrls: ['./newtask.component.css'],
})
export class NewTaskDialogComponent implements OnInit {
    systems: string[];
    meForm: FormGroup;
    methodList: System[];
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
            formData: new FormArray([]),
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
    ngOnInit(): void {
        this.meForm.get('system').valueChanges.subscribe((x: string) => {
            this.methodList = this.data.systemsList[x];
            console.log(this.methodList);
        });
        this.meForm.get('method').valueChanges.subscribe((x: System) => {
            // console.log(x.methodParameters);
            x.methodParameters.map(mparam => {
                (this.meForm.get('formData') as FormArray).push(new FormGroup({
                    type: new FormControl(mparam.name),
                    value: new FormControl(mparam.required)
                }));
            });
        });
        this.meForm.get('formData').valueChanges.subscribe((x: string) => {
            console.table(x);
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
