import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort } from '@angular/material';
import { Task, InitData, Env, System, SystemList, Parameter } from '../_models';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable()
export class TaskService {
    private host = environment.apiUrl;
    public taskSource: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
    public pages = {
        size: 25,
        sizeOptions: [25, 50, 75, 100],
        dataLength: 0
    };

    public environments: Env[];
    public systems: System[] = [];
    public systemsList: SystemList[];
    public parameters: Parameter[];
    get tasks(): Task[] { return this.taskSource.value; }

    constructor(private httpClient: HttpClient) {
        this.taskSource.next([]);
        this.allLoad();
    }

    private allLoad() {
        if (localStorage.getItem('systemInfo')) {
            this.loadSystemInfo(JSON.parse(localStorage.getItem('systemInfo')));
        } else {
            this.getSystemsInfo().subscribe(x => {
                localStorage.setItem('systemInfo', JSON.stringify(x));
                this.loadSystemInfo(x);
            })
        }
        this.getTasks(null, null);
        this.getCount();
        // this.getAllData().subscribe(x => {
        //     this.addTasks(x.data);
        //     this.pages.dataLength = x.count;
        // });
    }

    private loadSystemInfo(x: InitData) {
        this.systemsList = x.systems;
        this.environments = x.environments;
        Object.keys(this.systemsList).map(sys => this.systems = this.systems.concat(this.systemsList[sys]));
        this.parameters = this.addParameters(x.parameters);
    }

    private addParameters(data: Parameter[]): Parameter[] {
        const reqexpPachage = /[A-Za-z]+\./gi;
        Object.keys(data).map(x => {
            data[x].type = data[x].type.replace(reqexpPachage, '');
            if (data[x].type === 'List' && data[x].name.endsWith('List')) {
                data[x].values = data[data[x].name.slice(0, -4)].values;
            }
            if (data[x].type === 'String' && data[x].values) {
                data[x].type = 'Array';
            }
            if (data[x].values) {
                const vals = Object.assign(data[x].values);
                const copyValue = [];
                Object.keys(vals).map(value => {
                    copyValue.push({
                        value,
                        text: vals[value]
                    });
                });
                data[x].valuesList = copyValue.slice();
            }

        });
        return data;
    }

    private addTasks(data: any) {
        const copiedData = this.tasks.slice();
        data.forEach(element => copiedData.push(this.createTask(element)));
        this.taskSource.next(copiedData);
    }

    private createTask(data): Task {
        console.log(data);
        const gdata = data.gdata ? JSON.parse(data.gdata.value) : null;
        const progress = gdata
            ? `${gdata.length}/${gdata.filter(x => x.data).length}/${gdata.filter(x => x.error).length}/${data.total}`
            : '0/0/0/0';
        return {
            id: data.id,
            environment: this.environments.filter(x => x.id === data.id_environment)[0].name,
            methodname: this.systems.filter(x => x.className === data.class_name)[0].description,
            progress,
            created: data.created
        };
    }

    public getTasks(paginator: MatPaginator, sort: MatSort) {
        this.taskSource.next([]);
        const option = this.getRequestOption(paginator, sort);
        this.getTasksRequest(option).subscribe(tasks => this.addTasks(tasks));
    }

    // private getAllData() {
    //     const href = `${this.host}/api/data/getdata`;
    //     return this.httpClient.get<InitData>(href);
    // }

    private getTasksRequest(param: string): Observable<InitData> {
        const href = `${this.host}/api/data/getTasks${param}`;
        return this.httpClient.get<InitData>(href);
    }

    private getRequestOption(paginator: MatPaginator, sort: MatSort): string {
        if (paginator && sort) {
            return `?sortActive=${sort.active}&sortOrder=${sort.direction}&pageIndex=${paginator.pageIndex}&pageSize=${paginator.pageSize}`;
        } else {
            return `?pageSize=${this.pages.size}`;
        }
    }

    private getSystemsInfo() {
        const href = `${this.host}/api/data/getSystemsInfo`;
        return this.httpClient.get<InitData>(href);
    }
    private getCount() {
        const href = `${this.host}/api/data/getCount`;
        return this.httpClient.get<number>(href).subscribe(x => this.pages.dataLength = x);
    }
}
