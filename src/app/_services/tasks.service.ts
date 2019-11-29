import { HttpClient } from '@angular/common/http';
import { Task, InitData, Env, System, SystemList } from '../_models';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TaskService {
    private host = environment.apiUrl;
    public taskSource: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
    public environments: Env[];
    public systems: System[] = [];
    public systemsList: SystemList[];
    get tasks(): Task[] { return this.taskSource.value; }

    constructor(private httpClient: HttpClient) {
        this.allLoad();
    }
    allLoad() {
        this.getAllData().subscribe(x => {
            this.taskSource.next([]);
            this.systemsList = x.systems;
            this.environments = x.environments;
            Object.keys(this.systemsList).map(sys => this.systems = this.systems.concat(this.systemsList[sys]));
            this.addTasks(x.data);
        });
    }
    /*
        active: false
        class_name: "ru.homecredit.at.datagenerator.rest.systems.homer.HomerContractSC"
        count: 18
        count_generation: 3
        count_launch: 6
        created: "2019-11-27T11:54:46.078+0000"
        created_by: "aalyamkina@homecredit.ru"
        environment: "RT"
        finished: "2020-11-26T11:54:51.000+0000"
        hidden: false
        host: "OS-3213"
        id: 927
        id_environment: 17
        modified: "2019-11-27T13:20:59.988+0000"
        name: "Создание договора НК"
        parameters: "{"sellerplaceCode":"108976","creditAmount":"40000","finalStatus":"s","pumpCommMessages":"Нет","insuranceCodeList":"","isHomerSmsInformConnected":"Нет","repaymentMethod":"c","namedCardWithNoNameCard":"false","bic":"044525245","creditType":"SC","productType":"SC"}"
        periodicity: 15
        progress: "100.00% (18/0/18/18)"
        result: "ERROR"
        started: "2019-11-27T11:54:51.000+0000"
        status: "ERROR"
        taken: false
        total: 18
        worked: false
    */

    addTasks(data: any) {
        const copiedData = this.tasks.slice();
        data.forEach(element => copiedData.push(this.createTask(element)));
        this.taskSource.next(copiedData);
    }

    createTask(data): Task {
        return {
            id: data.id,
            environment: this.environments.filter(x => x.id === data.id_environment)[0].name,
            methodname: this.systems.filter(x => x.className === data.class_name)[0].description,
            progress: data.progress,
            created: data.created
        };
    }

    getAllData() {
        const href = `${this.host}/api/data`;
        return this.httpClient.get<InitData>(href);
    }

    getData(sort: string, order: string, page: number): Observable<InitData> {
        const href = `${this.host}/api/data`;
        const requestUrl = '';
        // `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

        return this.httpClient.get<InitData>(requestUrl);
    }
}
