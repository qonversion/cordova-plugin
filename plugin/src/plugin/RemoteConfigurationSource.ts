import {RemoteConfigurationAssignmentType, RemoteConfigurationSourceType} from "./enums";

export class RemoteConfigurationSource {
    id: string;
    name: string;
    type: RemoteConfigurationSourceType;
    assignmentType: RemoteConfigurationAssignmentType;
    contextKey: string | null;

    constructor(
      id: string,
      name: string,
      type: RemoteConfigurationSourceType,
      assignmentType: RemoteConfigurationAssignmentType,
      contextKey: string | null,
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.assignmentType = assignmentType;
        this.contextKey = contextKey;
    }
}
