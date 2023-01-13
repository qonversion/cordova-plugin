import {AutomationsEventType} from "./enums";

export class AutomationsEvent {

  type: AutomationsEventType;
  date: number;

  constructor(
    type: AutomationsEventType,
    date: number,
  ) {
    this.type = type;
    this.date = date;
  }
}
