import {DeferredPurchasesListener} from '../plugin/DeferredPurchasesListener';
import {EntitlementsUpdateListener} from '../plugin/EntitlementsUpdateListener';
import {QonversionConfig} from '../plugin/QonversionConfig';
import {QonversionConfigBuilder} from '../plugin/QonversionConfigBuilder';
import {LaunchMode, Environment, EntitlementsCacheLifetime, PurchaseResultStatus, PurchaseResultSource} from '../plugin/enums';
import {PurchaseResult} from '../plugin/PurchaseResult';
import Mapper, {QPurchaseResult} from '../plugin/Mapper';

// Mock cordova/device globals
(global as any).device = {platform: 'iOS'};
(global as any).window = {
  cordova: {
    exec: jest.fn(),
  },
  plugins: {},
};

describe('DeferredPurchasesListener', () => {

  describe('Interface', () => {
    it('should define onDeferredPurchaseCompleted method', () => {
      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      expect(listener.onDeferredPurchaseCompleted).toBeDefined();
      expect(typeof listener.onDeferredPurchaseCompleted).toBe('function');
    });

    it('should accept PurchaseResult as parameter', () => {
      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const purchaseResult = new PurchaseResult(
        PurchaseResultStatus.SUCCESS,
        new Map(),
        null,
        false,
        PurchaseResultSource.API,
        null,
      );

      listener.onDeferredPurchaseCompleted(purchaseResult);
      expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledWith(purchaseResult);
    });
  });

  describe('QonversionConfigBuilder', () => {
    it('should set deferred purchases listener via builder', () => {
      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setDeferredPurchasesListener(listener)
        .build();

      expect(config.deferredPurchasesListener).toBe(listener);
    });

    it('should have undefined deferred purchases listener by default', () => {
      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .build();

      expect(config.deferredPurchasesListener).toBeUndefined();
    });

    it('should support setting both listeners together', () => {
      const entitlementsListener: EntitlementsUpdateListener = {
        onEntitlementsUpdated: jest.fn(),
      };

      const deferredListener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setEntitlementsUpdateListener(entitlementsListener)
        .setDeferredPurchasesListener(deferredListener)
        .build();

      expect(config.entitlementsUpdateListener).toBe(entitlementsListener);
      expect(config.deferredPurchasesListener).toBe(deferredListener);
    });

    it('should support chaining with other builder methods', () => {
      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setEnvironment(Environment.SANDBOX)
        .setDeferredPurchasesListener(listener)
        .setEntitlementsCacheLifetime(EntitlementsCacheLifetime.WEEK)
        .build();

      expect(config.deferredPurchasesListener).toBe(listener);
      expect(config.environment).toBe(Environment.SANDBOX);
      expect(config.entitlementsCacheLifetime).toBe(EntitlementsCacheLifetime.WEEK);
    });
  });

  describe('QonversionConfig', () => {
    it('should store deferred purchases listener', () => {
      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfig(
        'test_key',
        LaunchMode.ANALYTICS,
        Environment.PRODUCTION,
        EntitlementsCacheLifetime.MONTH,
        undefined,
        listener,
        undefined,
        false,
      );

      expect(config.deferredPurchasesListener).toBe(listener);
    });
  });

  describe('QonversionInternal', () => {
    let mockExec: jest.Mock;

    beforeEach(() => {
      mockExec = jest.fn();
      (global as any).window.cordova.exec = mockExec;
    });

    it('should set deferred purchases listener at runtime', () => {
      // Simulate initializeSdk subscription
      mockExec.mockImplementation(() => {});

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS).build();
      const internal = new QonversionInternal(config);

      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      internal.setDeferredPurchasesListener(listener);
      expect(internal.deferredPurchasesListener).toBe(listener);
    });

    it('should store deferred purchases listener from config', () => {
      mockExec.mockImplementation(() => {});

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setDeferredPurchasesListener(listener)
        .build();

      const internal = new QonversionInternal(config);
      expect(internal.deferredPurchasesListener).toBe(listener);
    });

    it('should subscribe to native deferred purchase events on init', () => {
      mockExec.mockImplementation(() => {});

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS).build();
      const internal = new QonversionInternal(config);

      // Should have called exec for storeSDKInfo, initializeSdk, and subscribeDeferredPurchases
      const subscribeCalls = mockExec.mock.calls.filter(
        (call: any[]) => call[2] === 'QonversionPlugin' && call[3] === 'subscribeDeferredPurchases'
      );
      expect(subscribeCalls.length).toBe(1);
    });

    it('should forward native deferred purchase events to listener', () => {
      let deferredPurchaseCallback: ((data: any) => void) | null = null;
      mockExec.mockImplementation((success: any, error: any, module: string, method: string) => {
        if (method === 'subscribeDeferredPurchases') {
          deferredPurchaseCallback = success;
        }
      });

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const listener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setDeferredPurchasesListener(listener)
        .build();

      const internal = new QonversionInternal(config);

      // Simulate native event
      const rawPurchaseResult: QPurchaseResult = {
        status: 'Success',
        entitlements: {},
        error: null,
        isFallbackGenerated: false,
        source: 'Api',
        storeTransaction: {
          transactionId: 'txn_123',
          originalTransactionId: 'orig_txn_123',
          transactionTimestamp: 1700000000000,
          productId: 'com.test.product',
          quantity: 1,
          promoOfferId: null,
          purchaseToken: null,
        },
      };

      expect(deferredPurchaseCallback).not.toBeNull();
      deferredPurchaseCallback!(rawPurchaseResult);

      expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
      const receivedResult = (listener.onDeferredPurchaseCompleted as jest.Mock).mock.calls[0][0];
      expect(receivedResult).toBeInstanceOf(PurchaseResult);
      expect(receivedResult.status).toBe(PurchaseResultStatus.SUCCESS);
      expect(receivedResult.source).toBe(PurchaseResultSource.API);
      expect(receivedResult.storeTransaction?.transactionId).toBe('txn_123');
    });

    it('should not throw when deferred purchase event arrives without listener', () => {
      let deferredPurchaseCallback: ((data: any) => void) | null = null;
      mockExec.mockImplementation((success: any, error: any, module: string, method: string) => {
        if (method === 'subscribeDeferredPurchases') {
          deferredPurchaseCallback = success;
        }
      });

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS).build();
      const internal = new QonversionInternal(config);

      const rawPurchaseResult: QPurchaseResult = {
        status: 'Success',
        entitlements: {},
        error: null,
        isFallbackGenerated: false,
        source: 'Api',
        storeTransaction: null,
      };

      expect(deferredPurchaseCallback).not.toBeNull();
      expect(() => deferredPurchaseCallback!(rawPurchaseResult)).not.toThrow();
    });

    it('should keep both listeners independent', () => {
      let entitlementsCallback: ((data: any) => void) | null = null;
      let deferredPurchaseCallback: ((data: any) => void) | null = null;

      mockExec.mockImplementation((success: any, error: any, module: string, method: string) => {
        if (method === 'initializeSdk') {
          entitlementsCallback = success;
        } else if (method === 'subscribeDeferredPurchases') {
          deferredPurchaseCallback = success;
        }
      });

      const QonversionInternal = require('../plugin/QonversionInternal').default;

      const entitlementsListener: EntitlementsUpdateListener = {
        onEntitlementsUpdated: jest.fn(),
      };

      const deferredListener: DeferredPurchasesListener = {
        onDeferredPurchaseCompleted: jest.fn(),
      };

      const config = new QonversionConfigBuilder('test_key', LaunchMode.ANALYTICS)
        .setEntitlementsUpdateListener(entitlementsListener)
        .setDeferredPurchasesListener(deferredListener)
        .build();

      const internal = new QonversionInternal(config);

      // Trigger entitlements update
      expect(entitlementsCallback).not.toBeNull();
      entitlementsCallback!({});

      expect(entitlementsListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
      expect(deferredListener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();

      // Trigger deferred purchase
      const rawPurchaseResult: QPurchaseResult = {
        status: 'Pending',
        entitlements: null,
        error: null,
        isFallbackGenerated: false,
        source: 'Local',
        storeTransaction: null,
      };

      expect(deferredPurchaseCallback).not.toBeNull();
      deferredPurchaseCallback!(rawPurchaseResult);

      expect(deferredListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
      // Entitlements listener should not have been called again
      expect(entitlementsListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mapper.convertPurchaseResult', () => {
    it('should correctly convert raw purchase result data', () => {
      const rawPurchaseResult: QPurchaseResult = {
        status: 'Success',
        entitlements: {},
        error: null,
        isFallbackGenerated: false,
        source: 'Api',
        storeTransaction: {
          transactionId: 'txn_456',
          originalTransactionId: 'orig_txn_456',
          transactionTimestamp: 1700000000000,
          productId: 'com.test.monthly',
          quantity: 1,
          promoOfferId: null,
          purchaseToken: 'play_token_123',
        },
      };

      const result = Mapper.convertPurchaseResult(rawPurchaseResult);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(PurchaseResultStatus.SUCCESS);
      expect(result!.source).toBe(PurchaseResultSource.API);
      expect(result!.isFallbackGenerated).toBe(false);
      expect(result!.storeTransaction).not.toBeNull();
      expect(result!.storeTransaction!.transactionId).toBe('txn_456');
      expect(result!.storeTransaction!.purchaseToken).toBe('play_token_123');
    });

    it('should handle null purchase result', () => {
      const result = Mapper.convertPurchaseResult(null);
      expect(result).toBeNull();
    });
  });
});
