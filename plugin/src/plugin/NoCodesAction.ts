import {ActionType} from "./enums";
import {NoCodesError} from './NoCodesError';

class NoCodesAction {

  type: ActionType;
  parameters: Map<string, string | undefined> | undefined;
  error: NoCodesError | undefined;

  constructor(
    type: ActionType,
    parameters: Map<string, string | undefined> | undefined,
    error: NoCodesError | undefined,
  ) {
    this.type = type;
    this.parameters = parameters;
    this.error = error;
  }
}

export {NoCodesAction};
