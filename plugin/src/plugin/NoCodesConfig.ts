import {NoCodesListener} from './NoCodesListener';
import {PurchaseDelegate} from './PurchaseDelegate';
import {NoCodesTheme} from './enums';

class NoCodesConfig {
  readonly projectKey: string;
  readonly noCodesListener: NoCodesListener | undefined;
  readonly purchaseDelegate: PurchaseDelegate | undefined;
  readonly proxyUrl: string | undefined;
  readonly locale: string | undefined;
  readonly theme: NoCodesTheme | undefined;

  constructor(
    projectKey: string,
    noCodesListener: NoCodesListener | undefined = undefined,
    purchaseDelegate: PurchaseDelegate | undefined = undefined,
    proxyUrl: string | undefined = undefined,
    locale: string | undefined = undefined,
    theme: NoCodesTheme | undefined = undefined
  ) {
    this.projectKey = projectKey;
    this.noCodesListener = noCodesListener;
    this.purchaseDelegate = purchaseDelegate;
    this.proxyUrl = proxyUrl;
    this.locale = locale;
    this.theme = theme;
  }
}

export {NoCodesConfig};
