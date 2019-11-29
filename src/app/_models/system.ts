export class System {
    name: {
        description: string;
        full: string;
        path: string;
        className: string;
        method: string;
        methodParameters: [
            {
                name: string;
                required: boolean;
                order: number;
            }
        ],
        filterParameters: any
        key: number;
    };

}