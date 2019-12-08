import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { System, Env, DialogData } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
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
    methodDataList: any[];
    constructor(
        public dialogRef: MatDialogRef<NewTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {
        this.data = data;
        this.systems = Object.keys(data.systemsList);
        this.meForm = fb.group({
            environment: new FormControl('', Validators.required),
            system: new FormControl('', Validators.required),
            method: new FormControl('', Validators.required),
            methodData: new FormArray([])
        });
    }
    ngOnInit(): void {
        this.meForm.get('system').valueChanges.subscribe((system: string) => {
            this.methodList = this.data.systemsList[system];
        });
        this.meForm.get('method').valueChanges.subscribe((method: string) => {
            this.methodDataList = this.methodList.filter(x => x.path === method)[0].methodParameters
                .map(sysParam => {
                    const param = Object.assign(sysParam, this.data.parameters[sysParam.name]);
                    (this.meForm.get('methodData') as FormArray).push(new FormGroup({
                        name: new FormControl(param.name),
                        value: new FormControl(),
                    }));
                    return {
                        title: param.description,
                        name: param.name,
                        required: param.required,
                        values: this.data.parameters[sysParam.name].valuesList,
                        type: param.type
                    };
                });
            // console.table(this.meForm.controls['method'].;
        });
        // this.meForm.get('methodData').valueChanges.subscribe((x: any) => {
        //     console.table(x);
        // });
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
