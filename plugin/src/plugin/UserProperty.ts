import {UserPropertyKey} from "./enums";

export class UserProperty {
  key: string;
  value: string;

  /**
   * {@link UserPropertyKey} used to set this property.
   * Returns {@link UserPropertyKey.CUSTOM} for custom properties.
   */
  definedKey: UserPropertyKey;

  constructor(key: string, value: string, definedKey: UserPropertyKey) {
    this.key = key;
    this.value = value;
    this.definedKey = definedKey;
  }
}
