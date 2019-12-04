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
        this.meForm = fb.group({
            environment: new FormControl(),
            system: new FormControl(),
            method: new FormControl(),
            methodData: new FormArray([]),
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
                const isselect = this.data.parameters[mparam.name].values ? true : false; // mparam.name.endsWith('List');
                // const value = isselect ? this.data.parameters[mparam.name].values : '';
                const value = isselect ? Object.keys(this.data.parameters[mparam.name].values).map(key => {
                    return { value: key, view: this.data.parameters[mparam.name].values[key] };
                }) : '';
                console.log(value);
                // console.table(this.data.parameters[mparam.name]);
                (this.meForm.get('methodData') as FormArray).push(new FormGroup({
                    title: new FormControl(this.data.parameters[mparam.name].description),
                    name: new FormControl(mparam.name),
                    required: new FormControl(mparam.required),
                    isSelect: new FormControl(isselect),
                    values: new FormControl(value),
                }));
            });
        });
        this.meForm.get('methodData').valueChanges.subscribe((x: string) => {
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
