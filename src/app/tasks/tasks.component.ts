import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { UserService, AuthenticationService } from 'src/app/_services';

@Component({ templateUrl: 'tasks.component.html' })
export class TasksComponent implements AfterViewInit {
    displayedColumns: string[] = ['id', 'env', 'method', 'progress', 'created_by'];
    exampleDatabase: ExampleHttpDatabase | null;
    data: Task[] = [];

    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private httpClient: HttpClient) { }

    ngAfterViewInit() {
        this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);

        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.exampleDatabase!.getRepoIssues(
                        this.sort.active, this.sort.direction, this.paginator.pageIndex);
                }),
                map(data => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.resultsLength = data.count;

                    return data.data;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => this.data = data);
    }
}

export interface Tasks {
    data: Task[];
    count: number;
}

export interface Task {
    id: number;
    env: string;
    method: string;
    progress: string;
    created_by: string;
}
export class ExampleHttpDatabase {
    constructor(private httpClient: HttpClient) { }

    getRepoIssues(sort: string, order: string, page: number): Observable<Tasks> {
        const href = 'http://localhost:8081/api/data';
        const requestUrl =
            `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

        return this.httpClient.get<Tasks>(requestUrl);
    }
}