import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService, AuthenticationService, TaskService } from 'src/app/_services';
import { Task } from '../_models';
import { DataSource } from '@angular/cdk/collections';
import { Loading } from '../_models/loading';

@Component({
    templateUrl: 'tasks.component.html',
    styleUrls: ['./tasks.component.css'],
    providers: [TaskService]
})
export class TaskComponent implements OnInit {
    displayedColumns: string[] = ['id', 'env', 'method', 'progress', 'created'];
    dataSource: TaskDataSource | null;
    data: Task[] = [];
    resultsLength = 0;
    loading: Loading = { isLoadingResults: true, isRateLimitReached: false };

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(public taskService: TaskService) { }

    ngOnInit() {
        this.dataSource = new TaskDataSource(this.taskService, this.paginator, this.sort, this.loading);
        this.loading.isLoadingResults = false;
    }
}

export class TaskDataSource extends DataSource<any> {
    // filteredData: Task[] = [];
    renderedData: Task[] = [];
    constructor(private taskService: TaskService, private paginator: MatPaginator,
        private sort: MatSort, private loading: Loading) {
        super();
        // this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }
    connect(): Observable<Task[]> {
        const displayDataChanges = [
            this.taskService.taskSource,
            // this._paginator.page,
            // this._sort.sortChange,
        ];
        return merge(...displayDataChanges).pipe(map(() => {
            // const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = this.taskService.tasks.slice();
            this.loading.isLoadingResults = false;
            return this.renderedData;
        }));
    }
    disconnect() { }
}
