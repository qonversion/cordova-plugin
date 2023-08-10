import {Experiment} from "./Experiment";

export class RemoteConfig {
    payload: Map<string, Object>;
    experiment?: Experiment | null;

    constructor(payload: Map<string, Object>, experiment: Experiment | null) {
        this.payload = payload;
        this.experiment = experiment;
    }
}
