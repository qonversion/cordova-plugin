import {IntroEligibilityStatus} from "./enums";

export class IntroEligibility {
  status?: IntroEligibilityStatus;

  constructor(status: IntroEligibilityStatus | undefined) {
    this.status = status;
  }
}
