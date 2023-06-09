import {ActionResultType} from "./enums";
import {QonversionError} from "./QonversionError";

export class ActionResult {

  type: ActionResultType;
  value: Map<String, String | undefined> | undefined;
  error: QonversionError | undefined;

  constructor(
    type: ActionResultType,
    value: Map<String, String | undefined> | undefined,
    error: QonversionError | undefined,
  ) {
    this.type = type;
    this.value = value;
    this.error = error;
  }
}
