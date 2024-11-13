import {AutomationsDelegate} from './AutomationsDelegate';
import {ScreenPresentationConfig} from './ScreenPresentationConfig';

export interface AutomationsApi {
  /**
   * The Automations delegate is responsible for handling in-app screens and actions when push notification is received.
   * Make sure the method is called before {@link AutomationsApi.showScreen}.
   *
   * @param delegate the delegate to be notified about Automations events.
   */
  setDelegate(delegate: AutomationsDelegate): void;

  /**
   * Show the screen using its ID.
   * @param screenId identifier of the screen which must be shown
   * @returns promise to await for completion.
   */
  showScreen(screenId: string): Promise<void>;

  /**
   * Set the configuration of screen representation.
   * @param config a configuration to apply.
   * @param screenId identifier of screen, to which a config should be applied.
   *                 If not provided, the config is used for all the screens.
   */
  setScreenPresentationConfig(config: ScreenPresentationConfig, screenId?: string): void;
}

