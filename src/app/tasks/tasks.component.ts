import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { UserService, AuthenticationService, TaskService } from 'src/app/_services';
import { Task } from '../_models';
import { DataSource } from '@angular/cdk/collections';
import { Loading } from '../_models/loading';

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

    constructor(public taskService: TaskService) { }

    ngOnInit() {
        this.dataSource = new TaskDataSource(this.taskService, this.loading);
    }

    ngAfterViewInit() {
        merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
            this.taskService.getTasks(this.paginator, this.sort);
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
