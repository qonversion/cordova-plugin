import {AutomationsDelegate} from "./AutomationsDelegate";
import Mapper, {QAutomationEvent} from "./Mapper";
import {AutomationsApi} from './AutomationsApi';
import {ScreenPresentationConfig} from './ScreenPresentationConfig';
import {callAutomationsNative, callQonversionNative, noop} from './utils';

const EVENT_SCREEN_SHOWN = "automations_screen_shown";
const EVENT_ACTION_STARTED = "automations_action_started";
const EVENT_ACTION_FAILED = "automations_action_failed";
const EVENT_ACTION_FINISHED = "automations_action_finished";
const EVENT_AUTOMATIONS_FINISHED = "automations_finished";

export default class AutomationsInternal implements AutomationsApi {

  setDelegate(delegate: AutomationsDelegate) {
    AutomationsInternal.subscribe(delegate);
  }

  async showScreen(screenId: string): Promise<void> {
    return await callAutomationsNative('showScreen', [screenId]);
  }

  setScreenPresentationConfig(config: ScreenPresentationConfig, screenId?: string): void {
    const data = Mapper.convertScreenPresentationConfig(config);
    callAutomationsNative('setScreenPresentationConfig', [data, screenId]).then(noop);
  }

  private static subscribe(automationsDelegate: AutomationsDelegate) {
    callAutomationsNative<QAutomationEvent>('subscribe').then(event => {
      switch (event.event) {
        case EVENT_SCREEN_SHOWN:
          automationsDelegate.automationsDidShowScreen(event.payload.screenId);
          break;
        case EVENT_ACTION_STARTED:
          automationsDelegate.automationsDidStartExecuting(Mapper.convertActionResult(event.payload));
          break;
        case EVENT_ACTION_FAILED:
          automationsDelegate.automationsDidFailExecuting(Mapper.convertActionResult(event.payload));
          break;
        case EVENT_ACTION_FINISHED:
          automationsDelegate.automationsDidFinishExecuting(Mapper.convertActionResult(event.payload));
          break;
        case EVENT_AUTOMATIONS_FINISHED:
          automationsDelegate.automationsFinished();
          break;
      }
    });
  }
}
