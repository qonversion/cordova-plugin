import {ExperimentGroup} from "./ExperimentGroup";

export class Experiment {
    id: string;
    name: string;
    group: ExperimentGroup;

    constructor(id: string, name: string, group: ExperimentGroup) {
        this.id = id;
        this.name = name;
        this.group = group;
    }
}
