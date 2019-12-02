import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { UserService, AuthenticationService, TaskService } from 'src/app/_services';
import { Task } from '../_models';
import { DataSource } from '@angular/cdk/collections';
import { Loading } from '../_models/loading';
import { NewTaskDialogComponent } from './new/newtask.component';

@Component({
    templateUrl: 'tasks.component.html',
    styleUrls: ['./tasks.component.css'],
    providers: [TaskService]
})
export class TaskComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'env', 'method', 'progress', 'created'];
    dataSource: TaskDataSource | null;
    data: Task[] = [];
    loading: Loading = { isLoadingResults: true, isRateLimitReached: false };
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(public taskService: TaskService, public dialog: MatDialog) { }

    ngOnInit() {
        this.dataSource = new TaskDataSource(this.taskService, this.loading);
    }

    ngAfterViewInit() {
        merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
            this.taskService.getTasks(this.paginator, this.sort);
        });
    }

    openDialogNew(): void {
        const dialogRef = this.dialog.open(NewTaskDialogComponent, {
            width: '90%',
            data: { systemsList: Object.assign({}, this.taskService.systemsList), environments: this.taskService.environments.slice() }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.table(result);
            console.log('The dialog was closed');
        });
    }
}

export class TaskDataSource extends DataSource<any> {
    renderedData: Task[] = [];
    constructor(private taskService: TaskService, private loading: Loading) {
        super();
    }
    connect(): Observable<Task[]> {
        const displayDataChanges = [
            this.taskService.taskSource,
        ];
        return merge(...displayDataChanges).pipe(map(() => {
            this.renderedData = this.taskService.tasks.slice();
            this.loading.isLoadingResults = false;
            return this.renderedData;
        }));
    }
    disconnect() { }
}
