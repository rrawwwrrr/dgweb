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
        this.allLoad();
    }

    public allLoad() {
        this.getAllData().subscribe(x => {
            this.taskSource.next([]);
            this.systemsList = x.systems;
            this.environments = x.environments;
            Object.keys(this.systemsList).map(sys => this.systems = this.systems.concat(this.systemsList[sys]));
            this.addTasks(x.data);
            this.pages.dataLength = x.count;
            this.parameters = this.addParameters(x.parameters);
        });
    }

    addParameters(data: Parameter[]): Parameter[] {
        const reqexpPachage = /[A-Za-z]+\./gi;
        Object.keys(data).map(x => {
            data[x].type = data[x].type.replace(reqexpPachage, '');
            if (data[x].type === 'List' && data[x].name.endsWith('List')) {
                data[x].values = data[data[x].name.slice(0, -4)].values;
            }
            if(data[x].type === 'String' && data[x].values){
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
        console.table(data);
        return data;
    }

    addTasks(data: any) {
        const copiedData = this.tasks.slice();
        data.forEach(element => copiedData.push(this.createTask(element)));
        this.taskSource.next(copiedData);
    }
    createTask(data): Task {
        const gdata = data.gdata;
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
    getTasks(paginator: MatPaginator, sort: MatSort) {
        this.taskSource.next([]);
        const option = this.getGetRequestOption(paginator, sort);
        this.getTasksRequest(option).subscribe(tasks => this.addTasks(tasks));
    }

    getAllData() {
        const href = `${this.host}/api/data/getdata`;
        return this.httpClient.get<InitData>(href);
    }

    getTasksRequest(param: string): Observable<InitData> {
        const href = `${this.host}/api/data/gettasks/${param}`;
        return this.httpClient.get<InitData>(href);
    }

    getGetRequestOption(paginator: MatPaginator, sort: MatSort): string {
        return `?sortActive=${sort.active}&sortOrder=${sort.direction}&pageIndex=${paginator.pageIndex}&pageSize=${paginator.pageSize}`;
    }
}
