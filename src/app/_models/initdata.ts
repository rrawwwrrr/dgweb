import { Task, Env, SystemList, GenData, Parameter } from './index';

export class InitData {
    data: Task[];
    count: number;
    gdata: GenData[];
    environments: Env[];
    systems: SystemList[];
    parameters: Parameter[];
}
