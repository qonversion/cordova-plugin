/**
 * Qonversion SDK Cordova Sample Application
 * Demonstrates all SDK capabilities including No-Codes
 */

const PROJECT_KEY = 'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2';

const App = {
    // State
    isQonversionInitialized: false,
    isNoCodesInitialized: false,
    currentScreen: 'main',
    screenHistory: [],
    products: null,
    selectedProduct: null,
    userInfo: null,
    noCodesEvents: [],

    // Initialize app
    initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady() {
        console.log('🚀 Device ready - Cordova ' + cordova.platformId + '@' + cordova.version);
        this.bindEvents();
        this.initializeQonversion();
    },

    // Bind all UI events
    bindEvents() {
        // Navigation
        document.getElementById('back-button').addEventListener('click', () => this.goBack());
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => this.navigateTo(item.dataset.screen));
        });

        // Copy to clipboard
        document.querySelectorAll('.copy-text').forEach(el => {
            el.addEventListener('click', () => {
                const text = el.textContent;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                }
                this.showToast('Copied to clipboard', 'success');
            });
        });

        // Products Screen
        document.getElementById('load-products').addEventListener('click', () => this.loadProducts());
        document.getElementById('purchase-btn').addEventListener('click', () => this.purchase());
        document.getElementById('update-purchase-btn').addEventListener('click', () => this.updatePurchase());
        document.getElementById('get-promo-offer-btn').addEventListener('click', () => this.getPromoOffer());
        document.getElementById('check-eligibility-btn').addEventListener('click', () => this.checkTrialIntroEligibility());

        // Entitlements Screen
        document.getElementById('check-entitlements').addEventListener('click', () => this.checkEntitlements());
        document.getElementById('restore-purchases').addEventListener('click', () => this.restore());
        document.getElementById('sync-purchases').addEventListener('click', () => this.syncPurchases());
        document.getElementById('sync-historical').addEventListener('click', () => this.syncHistoricalData());
        document.getElementById('set-entitlements-listener').addEventListener('click', () => this.setEntitlementsUpdateListener());

        // Offerings Screen
        document.getElementById('load-offerings').addEventListener('click', () => this.loadOfferings());

        // Remote Configs Screen
        document.getElementById('load-remote-config').addEventListener('click', () => this.loadRemoteConfig());
        document.getElementById('load-remote-config-list').addEventListener('click', () => this.loadRemoteConfigList());

        // User Screen
        document.getElementById('load-user-info').addEventListener('click', () => this.loadUserInfo());
        document.getElementById('identify-btn').addEventListener('click', () => this.identify());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('load-user-properties').addEventListener('click', () => this.loadUserProperties());
        document.getElementById('set-property-btn').addEventListener('click', () => this.setUserProperty());
        document.getElementById('send-attribution-btn').addEventListener('click', () => this.sendAttribution());

        // Property type radio change
        document.querySelectorAll('input[name="property-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const customKeyInput = document.getElementById('custom-property-key');
                customKeyInput.classList.toggle('hidden', e.target.value !== 'custom');
            });
        });

        // No-Codes Screen
        document.getElementById('init-nocodes-btn').addEventListener('click', () => this.initializeNoCodes());
        document.getElementById('show-screen-btn').addEventListener('click', () => this.showNoCodesScreen());
        document.getElementById('set-presentation-config-btn').addEventListener('click', () => this.setScreenPresentationConfig());
        document.getElementById('set-locale-btn').addEventListener('click', () => this.setLocale());
        document.getElementById('reset-locale-btn').addEventListener('click', () => this.resetLocale());
        document.getElementById('close-nocodes-btn').addEventListener('click', () => this.closeNoCodes());

        // Product Detail Screen
        document.getElementById('purchase-product-btn').addEventListener('click', () => this.purchaseSelectedProduct());

        // Other Screen
        document.getElementById('check-fallback-file').addEventListener('click', () => this.checkFallbackFile());
        document.getElementById('collect-advertising-id').addEventListener('click', () => this.collectAdvertisingId());
        document.getElementById('collect-asa-attribution').addEventListener('click', () => this.collectAppleSearchAdsAttribution());
        document.getElementById('present-code-redemption').addEventListener('click', () => this.presentCodeRedemptionSheet());
        document.getElementById('set-promo-delegate').addEventListener('click', () => this.setPromoPurchasesDelegate());
    },

    // Navigation
    navigateTo(screenId) {
        this.screenHistory.push(this.currentScreen);
        this.showScreen(screenId);
    },

    goBack() {
        if (this.screenHistory.length > 0) {
            // Clear selected product when leaving product detail
            if (this.currentScreen === 'product-detail') {
                this.selectedProduct = null;
            }
            const previousScreen = this.screenHistory.pop();
            this.showScreen(previousScreen);
        }
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${screenId}-screen`).classList.add('active');
        
        const backButton = document.getElementById('back-button');
        const headerTitle = document.getElementById('header-title');
        
        if (screenId === 'main') {
            backButton.classList.add('hidden');
            headerTitle.textContent = 'Qonversion SDK Demo';
        } else {
            backButton.classList.remove('hidden');
            headerTitle.textContent = this.getScreenTitle(screenId);
        }
        
        this.currentScreen = screenId;
    },

    getScreenTitle(screenId) {
        const titles = {
            'products': 'Products',
            'product-detail': 'Product Details',
            'entitlements': 'Entitlements',
            'offerings': 'Offerings',
            'remote-configs': 'Remote Configs',
            'user': 'User',
            'nocodes': 'No-Codes',
            'other': 'Other'
        };
        return titles[screenId] || 'Screen';
    },

    // UI Helpers
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    },

    updateInitStatus(status) {
        const statusEl = document.getElementById('init-status');
        const indicator = statusEl.querySelector('.status-indicator');
        const text = statusEl.querySelector('span');
        
        indicator.className = 'status-indicator';
        switch(status) {
            case 'initializing':
                indicator.classList.add('yellow');
                text.textContent = 'Initializing...';
                break;
            case 'success':
                indicator.classList.add('green');
                text.textContent = 'Initialized';
                break;
            case 'error':
                indicator.classList.add('red');
                text.textContent = 'Initialization Failed';
                break;
            default:
                indicator.classList.add('gray');
                text.textContent = 'Not Initialized';
        }
    },

    updateUserInfoDisplay() {
        const section = document.getElementById('user-info-section');
        const mainQonId = document.getElementById('main-qonversion-id');
        const mainIdentityId = document.getElementById('main-identity-id');
        const userQonId = document.getElementById('user-qonversion-id');
        const userIdentityId = document.getElementById('user-identity-id');
        
        if (this.userInfo) {
            section.classList.remove('hidden');
            mainQonId.textContent = this.userInfo.qonversionId || '-';
            mainIdentityId.textContent = this.userInfo.identityId || 'Anonymous';
            userQonId.textContent = this.userInfo.qonversionId || '-';
            userIdentityId.textContent = this.userInfo.identityId || 'Anonymous';
        }
    },

    addNoCodesEvent(event) {
        const time = new Date().toLocaleTimeString();
        this.noCodesEvents.unshift({ time, event });
        this.renderNoCodesEvents();
    },

    renderNoCodesEvents() {
        const container = document.getElementById('nocodes-events');
        container.innerHTML = this.noCodesEvents.map(e => 
            `<div class="event-item"><span class="time">${e.time}</span>${e.event}</div>`
        ).join('');
    },

    // ==========================================
    // QONVERSION SDK METHODS
    // ==========================================

    initializeQonversion() {
        try {
            console.log('🔄 Initializing Qonversion SDK...');
            this.updateInitStatus('initializing');

        const config = new Qonversion.ConfigBuilder(
                PROJECT_KEY,
                Qonversion.LaunchMode.SUBSCRIPTION_MANAGEMENT
        )
          .setEnvironment(Qonversion.Environment.SANDBOX)
          .setEntitlementsCacheLifetime(Qonversion.EntitlementsCacheLifetime.MONTH)
          .setEntitlementsUpdateListener({
                    onEntitlementsUpdated: (entitlements) => {
                        console.log('📡 Entitlements updated!', entitlements);
                        this.showToast('Entitlements updated!', 'success');
                    }
          })
          .build();

        Qonversion.initialize(config);
            this.isQonversionInitialized = true;
            this.updateInitStatus('success');
            console.log('✅ Qonversion SDK initialized');

            // Load user info
            this.loadUserInfo();
        } catch (error) {
            console.error('❌ Qonversion initialization failed:', error);
            this.updateInitStatus('error');
            this.showToast('Initialization failed: ' + error.message, 'error');
        }
    },

    // PRODUCTS
    async loadProducts() {
        try {
            this.showLoading();
            console.log('🔄 Loading products...');
            const productsResult = await Qonversion.getSharedInstance().products();
            console.log('✅ Products loaded:', productsResult);
            
            // Convert to Map if it's not already (could be Object or Map)
            if (productsResult instanceof Map) {
                this.products = productsResult;
            } else {
                this.products = new Map(Object.entries(productsResult || {}));
            }
            
            const container = document.getElementById('products-list');
            if (this.products.size === 0) {
                container.innerHTML = '<div class="list-item"><p>No products found</p></div>';
            } else {
                container.innerHTML = Array.from(this.products.entries()).map(([id, product]) => `
                    <div class="list-item product-card" data-product-id="${id}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4>${product.qonversionId || id}</h4>
                                <p>Store ID: ${product.storeId || '-'}</p>
                                <p>Price: ${product.prettyPrice || '-'}</p>
                                <p>Type: ${product.type || '-'}</p>
                                ${product.subscriptionPeriod ? `<p>Period: ${product.subscriptionPeriod.unitCount} ${product.subscriptionPeriod.unit}</p>` : ''}
                            </div>
                            <span class="arrow">→</span>
                        </div>
                    </div>
                `).join('');
                
                // Add click handlers to product cards
                container.querySelectorAll('.product-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const productId = card.dataset.productId;
                        this.openProductDetail(productId);
                    });
                });
            }
            this.showToast('Products loaded', 'success');
        } catch (error) {
            console.error('❌ Load products failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    openProductDetail(productId) {
        const product = this.products.get(productId);
        if (!product) {
            this.showToast('Product not found', 'error');
            return;
        }
        
        this.selectedProduct = product;
        
        // Update UI
        document.getElementById('product-detail-title').textContent = product.storeTitle || product.qonversionId;
        document.getElementById('product-detail-price').textContent = product.prettyPrice || '';
        
        // Basic info
        const basicInfo = document.getElementById('product-basic-info');
        basicInfo.innerHTML = this.renderProductField('Qonversion ID', product.qonversionId) +
            this.renderProductField('Store ID', product.storeId) +
            this.renderProductField('Base Plan ID', product.basePlanId) +
            this.renderProductField('Type', product.type) +
            this.renderProductField('Offering ID', product.offeringId);
        
        // Pricing info
        const pricingInfo = document.getElementById('product-pricing-info');
        pricingInfo.innerHTML = this.renderProductField('Pretty Price', product.prettyPrice) +
            this.renderProductField('Price', product.price) +
            this.renderProductField('Currency Code', product.currencyCode) +
            this.renderProductField('Introductory Price', product.prettyIntroductoryPrice);
        
        // Store info
        const storeInfo = document.getElementById('product-store-info');
        storeInfo.innerHTML = this.renderProductField('Store Title', product.storeTitle) +
            this.renderProductField('Store Description', product.storeDescription);
        
        // Subscription info
        const subInfo = document.getElementById('product-subscription-info');
        let subHtml = '';
        if (product.subscriptionPeriod) {
            subHtml += this.renderProductField('Subscription Period', 
                `${product.subscriptionPeriod.unitCount} ${product.subscriptionPeriod.unit}`);
        }
        if (product.trialPeriod) {
            subHtml += this.renderProductField('Trial Period', 
                `${product.trialPeriod.unitCount} ${product.trialPeriod.unit}`);
        }
        subInfo.innerHTML = subHtml || '<p style="color: var(--text-muted);">No subscription details</p>';
        
        // Clear offer ID
        document.getElementById('detail-offer-id').value = '';
        
        // Navigate
        this.navigateTo('product-detail');
    },

    renderProductField(label, value) {
        if (value === null || value === undefined || value === '') return '';
        return `<div class="product-field">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        </div>`;
    },

    async purchaseSelectedProduct() {
        if (!this.selectedProduct) {
            this.showToast('No product selected', 'error');
            return;
        }

        const offerId = document.getElementById('detail-offer-id').value.trim();
        
        try {
            this.showLoading();
            console.log('🔄 Purchasing product:', this.selectedProduct.qonversionId);
            
            const purchaseOptions = offerId ? new Qonversion.PurchaseOptionsBuilder().setOfferId(offerId).build() : undefined;
            const entitlements = await Qonversion.getSharedInstance().purchaseProduct(this.selectedProduct, purchaseOptions);
            
            console.log('✅ Purchase successful:', entitlements);
            this.showToast('Purchase successful!', 'success');
        } catch (error) {
            console.error('❌ Purchase failed:', error);
            this.showToast('Purchase failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async purchase() {
        const productId = document.getElementById('product-id').value;
        const offerId = document.getElementById('offer-id').value;
        
        if (!productId) {
            this.showToast('Please enter a product ID', 'error');
            return;
        }

        try {
            this.showLoading();
            console.log('🔄 Purchasing product:', productId);
            
            if (!this.products) {
                this.products = await Qonversion.getSharedInstance().products();
            }
            
            const product = this.products.get(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const purchaseOptions = offerId ? new Qonversion.PurchaseOptionsBuilder().setOfferId(offerId).build() : undefined;
            const entitlements = await Qonversion.getSharedInstance().purchaseProduct(product, purchaseOptions);
            
            console.log('✅ Purchase successful:', entitlements);
            this.showToast('Purchase successful!', 'success');
        } catch (error) {
            console.error('❌ Purchase failed:', error);
            this.showToast('Purchase failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async updatePurchase() {
        const productId = document.getElementById('update-product-id').value;
        const oldProductId = document.getElementById('old-product-id').value;
        
        if (!productId || !oldProductId) {
            this.showToast('Please enter both product IDs', 'error');
            return;
        }

        try {
            this.showLoading();
            console.log('🔄 Updating purchase:', productId, '<-', oldProductId);
            
            if (!this.products) {
                this.products = await Qonversion.getSharedInstance().products();
            }
            
            const product = this.products.get(productId);
            if (!product) {
                throw new Error('New product not found');
            }

            const purchaseUpdateModel = product.toPurchaseUpdateModel(oldProductId, Qonversion.PurchaseUpdatePolicy.CHARGE_FULL_PRICE);
            const entitlements = await Qonversion.getSharedInstance().updatePurchase(purchaseUpdateModel);
            
            console.log('✅ Update purchase successful:', entitlements);
            this.showToast('Update successful!', 'success');
        } catch (error) {
            console.error('❌ Update purchase failed:', error);
            this.showToast('Update failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async getPromoOffer() {
        if (device.platform !== 'iOS') {
            this.showToast('iOS only feature', 'error');
            return;
        }

        const productId = document.getElementById('promo-product-id').value;
        const discountId = document.getElementById('discount-id').value;
        
        if (!productId || !discountId) {
            this.showToast('Please enter both IDs', 'error');
            return;
        }

        try {
            this.showLoading();
            console.log('🔄 Getting promo offer:', productId, discountId);
            
            if (!this.products) {
                this.products = await Qonversion.getSharedInstance().products();
            }
            
            const product = this.products.get(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const discount = product.skProduct?.discounts?.find(d => d.identifier === discountId);
            if (!discount) {
                throw new Error('Discount not found');
            }

            const promoOffer = await Qonversion.getSharedInstance().getPromotionalOffer(product, discount);
            console.log('✅ Promo offer:', promoOffer);
            this.showToast('Promo offer loaded!', 'success');
        } catch (error) {
            console.error('❌ Get promo offer failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async checkTrialIntroEligibility() {
        const idsInput = document.getElementById('eligibility-ids').value;
        if (!idsInput) {
            this.showToast('Please enter product IDs', 'error');
            return;
        }

        const ids = idsInput.split(',').map(id => id.trim());

        try {
            this.showLoading();
            console.log('🔄 Checking eligibility for:', ids);
        const eligibilities = await Qonversion.getSharedInstance().checkTrialIntroEligibility(ids);
            console.log('✅ Eligibilities:', eligibilities);
            
            const container = document.getElementById('eligibility-result');
            container.textContent = JSON.stringify(Object.fromEntries(eligibilities), null, 2);
            this.showToast('Eligibility checked!', 'success');
        } catch (error) {
            console.error('❌ Check eligibility failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    // ENTITLEMENTS
    async checkEntitlements() {
        try {
            this.showLoading();
            console.log('🔄 Checking entitlements...');
            const entitlements = await Qonversion.getSharedInstance().checkEntitlements();
            console.log('✅ Entitlements:', entitlements);
            
            const container = document.getElementById('entitlements-list');
            if (entitlements.size === 0) {
                container.innerHTML = '<div class="list-item"><p>No active entitlements</p></div>';
            } else {
                container.innerHTML = Array.from(entitlements.entries()).map(([id, ent]) => `
                    <div class="list-item">
                        <h4>${ent.id}</h4>
                        <p>Active: ${ent.isActive ? 'Yes' : 'No'}</p>
                        <p>Product ID: ${ent.productId || '-'}</p>
                        <p>Source: ${ent.source || '-'}</p>
                        ${ent.expirationDate ? `<p>Expires: ${new Date(ent.expirationDate).toLocaleDateString()}</p>` : ''}
                        <span class="tag">${ent.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                `).join('');
            }
            this.showToast('Entitlements loaded', 'success');
        } catch (error) {
            console.error('❌ Check entitlements failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async restore() {
        try {
            this.showLoading();
            console.log('🔄 Restoring purchases...');
            const entitlements = await Qonversion.getSharedInstance().restore();
            console.log('✅ Restore successful:', entitlements);
            this.showToast('Restore successful!', 'success');
        } catch (error) {
            console.error('❌ Restore failed:', error);
            this.showToast('Restore failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async syncPurchases() {
        try {
            this.showLoading();
            console.log('🔄 Syncing purchases...');
        await Qonversion.getSharedInstance().syncPurchases();
            console.log('✅ Sync successful');
            this.showToast('Purchases synced!', 'success');
        } catch (error) {
            console.error('❌ Sync failed:', error);
            this.showToast('Sync failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async syncHistoricalData() {
        try {
            this.showLoading();
            console.log('🔄 Syncing historical data...');
        await Qonversion.getSharedInstance().syncHistoricalData();
            console.log('✅ Historical sync successful');
            this.showToast('Historical data synced!', 'success');
        } catch (error) {
            console.error('❌ Historical sync failed:', error);
            this.showToast('Sync failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    setEntitlementsUpdateListener() {
        Qonversion.getSharedInstance().setEntitlementsUpdateListener({
            onEntitlementsUpdated: (entitlements) => {
                console.log('📡 Entitlements updated!', entitlements);
                this.showToast('Entitlements updated!', 'success');
            }
        });
        console.log('✅ Entitlements update listener set');
        this.showToast('Listener set!', 'success');
    },

    // OFFERINGS
    async loadOfferings() {
        try {
            this.showLoading();
            console.log('🔄 Loading offerings...');
            const offerings = await Qonversion.getSharedInstance().offerings();
            console.log('✅ Offerings:', offerings);
            
            const container = document.getElementById('offerings-list');
            if (!offerings || !offerings.availableOfferings || offerings.availableOfferings.length === 0) {
                container.innerHTML = '<div class="list-item"><p>No offerings found</p></div>';
            } else {
                container.innerHTML = offerings.availableOfferings.map(offering => `
                    <div class="list-item">
                        <h4>${offering.id}</h4>
                        ${offering.tag ? `<span class="tag">${offering.tag}</span>` : ''}
                        <p>Products: ${offering.products?.length || 0}</p>
                        ${offering.products?.map(p => `<p>• ${p.qonversionId}</p>`).join('') || ''}
                    </div>
                `).join('');
            }
            this.showToast('Offerings loaded', 'success');
        } catch (error) {
            console.error('❌ Load offerings failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    // REMOTE CONFIGS
    async loadRemoteConfig() {
        try {
            this.showLoading();
            console.log('🔄 Loading remote config...');
            const remoteConfig = await Qonversion.getSharedInstance().remoteConfig();
            console.log('✅ Remote config:', remoteConfig);
            
            document.getElementById('remote-config-result').textContent = JSON.stringify(remoteConfig, null, 2);
            this.showToast('Remote config loaded', 'success');
        } catch (error) {
            console.error('❌ Load remote config failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async loadRemoteConfigList() {
        try {
            this.showLoading();
            console.log('🔄 Loading remote config list...');
            const remoteConfigList = await Qonversion.getSharedInstance().remoteConfigList();
            console.log('✅ Remote config list:', remoteConfigList);
            
            document.getElementById('remote-config-result').textContent = JSON.stringify(remoteConfigList, null, 2);
            this.showToast('Remote config list loaded', 'success');
        } catch (error) {
            console.error('❌ Load remote config list failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    // USER
    async loadUserInfo() {
        try {
            console.log('🔄 Loading user info...');
            this.userInfo = await Qonversion.getSharedInstance().userInfo();
            console.log('✅ User info:', this.userInfo);
            this.updateUserInfoDisplay();
        } catch (error) {
            console.error('❌ Load user info failed:', error);
        }
    },

    async identify() {
        const userId = document.getElementById('identity-input').value;
        if (!userId) {
            this.showToast('Please enter a user ID', 'error');
            return;
        }

        try {
            this.showLoading();
            console.log('🔄 Identifying user:', userId);
            this.userInfo = await Qonversion.getSharedInstance().identify(userId);
            console.log('✅ User identified:', this.userInfo);
            this.updateUserInfoDisplay();
            this.showToast('User identified!', 'success');
        } catch (error) {
            console.error('❌ Identify failed:', error);
            this.showToast('Identify failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    async logout() {
        try {
            console.log('🔄 Logging out...');
        Qonversion.getSharedInstance().logout();
            console.log('✅ Logged out');
            
            this.userInfo = await Qonversion.getSharedInstance().userInfo();
            this.updateUserInfoDisplay();
            this.showToast('Logged out!', 'success');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            this.showToast('Logout failed: ' + error.message, 'error');
        }
    },

    async loadUserProperties() {
        try {
            this.showLoading();
            console.log('🔄 Loading user properties...');
            const properties = await Qonversion.getSharedInstance().userProperties();
            console.log('✅ User properties:', properties);
            
            document.getElementById('user-properties-list').textContent = JSON.stringify(properties, null, 2);
            this.showToast('Properties loaded', 'success');
        } catch (error) {
            console.error('❌ Load properties failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    setUserProperty() {
        const propertyType = document.querySelector('input[name="property-type"]:checked').value;
        const customKey = document.getElementById('custom-property-key').value;
        const value = document.getElementById('property-value').value;

        if (!value) {
            this.showToast('Please enter a value', 'error');
            return;
        }

        try {
            console.log('🔄 Setting user property:', propertyType, value);
            
            if (propertyType === 'custom') {
                if (!customKey) {
                    this.showToast('Please enter a custom key', 'error');
                    return;
                }
                Qonversion.getSharedInstance().setCustomUserProperty(customKey, value);
            } else {
                const keyMap = {
                    'email': Qonversion.UserPropertyKey.EMAIL,
                    'name': Qonversion.UserPropertyKey.NAME,
                    'advertisingId': Qonversion.UserPropertyKey.ADVERTISING_ID,
                    'appsFlyerUserId': Qonversion.UserPropertyKey.APPS_FLYER_USER_ID,
                    'adjustAdId': Qonversion.UserPropertyKey.ADJUST_AD_ID,
                    'firebaseAppInstanceId': Qonversion.UserPropertyKey.FIREBASE_APP_INSTANCE_ID
                };
                Qonversion.getSharedInstance().setUserProperty(keyMap[propertyType], value);
            }
            
            console.log('✅ Property set');
            this.showToast('Property set!', 'success');
        } catch (error) {
            console.error('❌ Set property failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    sendAttribution() {
        const provider = document.querySelector('input[name="attribution-provider"]:checked').value;
        const dataStr = document.getElementById('attribution-data').value;

        if (!dataStr) {
            this.showToast('Please enter attribution data', 'error');
            return;
        }

        try {
            const data = JSON.parse(dataStr);
            console.log('🔄 Sending attribution:', provider, data);
            
            const providerMap = {
                'appsFlyer': Qonversion.AttributionProvider.APPSFLYER,
                'branch': Qonversion.AttributionProvider.BRANCH,
                'adjust': Qonversion.AttributionProvider.ADJUST,
                'appleSearchAds': Qonversion.AttributionProvider.APPLE_SEARCH_ADS,
                'appleAdServices': Qonversion.AttributionProvider.APPLE_AD_SERVICES
            };
            
            Qonversion.getSharedInstance().attribution(data, providerMap[provider]);
            console.log('✅ Attribution sent');
            this.showToast('Attribution sent!', 'success');
        } catch (error) {
            console.error('❌ Send attribution failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    // ==========================================
    // NO-CODES SDK METHODS
    // ==========================================

    initializeNoCodes() {
        try {
            console.log('🔄 Initializing No-Codes SDK...');
            
            const config = new Qonversion.NoCodesConfigBuilder(PROJECT_KEY)
                .setNoCodesListener({
                    onScreenShown: (id) => {
                        console.log('📡 Screen shown:', id);
                        this.addNoCodesEvent(`Screen shown: ${id}`);
                    },
                    onActionStartedExecuting: (action) => {
                        console.log('📡 Action started:', action);
                        this.addNoCodesEvent(`Action started: ${action.type}`);
                    },
                    onActionFailedToExecute: (action) => {
                        console.log('📡 Action failed:', action);
                        this.addNoCodesEvent(`Action failed: ${action.type}`);
                    },
                    onActionFinishedExecuting: (action) => {
                        console.log('📡 Action finished:', action);
                        this.addNoCodesEvent(`Action finished: ${action.type}`);
                    },
                    onFinished: () => {
                        console.log('📡 Flow finished');
                        this.addNoCodesEvent('Flow finished');
                    },
                    onScreenFailedToLoad: (error) => {
                        console.log('📡 Screen failed to load:', error);
                        this.addNoCodesEvent(`Screen failed: ${error.description || error.code}`);
                        Qonversion.NoCodes.getSharedInstance().close();
                    }
                })
                .build();

            Qonversion.NoCodes.initialize(config);
            this.isNoCodesInitialized = true;
            console.log('✅ No-Codes SDK initialized');
            this.addNoCodesEvent('SDK Initialized');
            this.showToast('No-Codes initialized!', 'success');
        } catch (error) {
            console.error('❌ No-Codes initialization failed:', error);
            this.showToast('Initialization failed: ' + error.message, 'error');
        }
    },

    showNoCodesScreen() {
        if (!this.isNoCodesInitialized) {
            this.showToast('Please initialize No-Codes first', 'error');
            return;
        }

        const contextKey = document.getElementById('context-key').value;
        if (!contextKey) {
            this.showToast('Please enter a context key', 'error');
            return;
        }

        try {
            console.log('🔄 Showing No-Codes screen:', contextKey);
            Qonversion.NoCodes.getSharedInstance().showScreen(contextKey);
            console.log('✅ Show screen called');
        } catch (error) {
            console.error('❌ Show screen failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    setScreenPresentationConfig() {
        if (!this.isNoCodesInitialized) {
            this.showToast('Please initialize No-Codes first', 'error');
            return;
        }

        const style = document.querySelector('input[name="presentation-style"]:checked').value;
        const animated = document.getElementById('animated-checkbox').checked;
        const contextKey = document.getElementById('context-key').value;

        try {
            console.log('🔄 Setting presentation config:', style, animated);
            
            const styleMap = {
                'fullScreen': Qonversion.ScreenPresentationStyle.FULL_SCREEN,
                'popover': Qonversion.ScreenPresentationStyle.POPOVER,
                'push': Qonversion.ScreenPresentationStyle.PUSH,
                'noAnimation': Qonversion.ScreenPresentationStyle.NO_ANIMATION
            };
            
            const config = new Qonversion.ScreenPresentationConfig(styleMap[style], animated);
            Qonversion.NoCodes.getSharedInstance().setScreenPresentationConfig(config, contextKey);
            
            console.log('✅ Presentation config set');
            this.showToast('Config set!', 'success');
        } catch (error) {
            console.error('❌ Set presentation config failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    setLocale() {
        if (!this.isNoCodesInitialized) {
            this.showToast('Please initialize No-Codes first', 'error');
            return;
        }

        const locale = document.getElementById('locale-input').value.trim() || null;

        try {
            console.log('🔄 Setting locale:', locale);
            Qonversion.NoCodes.getSharedInstance().setLocale(locale);
            console.log('✅ Locale set');
            this.showToast(locale ? `Locale set to: ${locale}` : 'Locale reset to device default', 'success');
        } catch (error) {
            console.error('❌ Set locale failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    resetLocale() {
        if (!this.isNoCodesInitialized) {
            this.showToast('Please initialize No-Codes first', 'error');
            return;
        }

        try {
            console.log('🔄 Resetting locale...');
            Qonversion.NoCodes.getSharedInstance().setLocale(null);
            document.getElementById('locale-input').value = '';
            console.log('✅ Locale reset');
            this.showToast('Locale reset to device default', 'success');
        } catch (error) {
            console.error('❌ Reset locale failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    closeNoCodes() {
        if (!this.isNoCodesInitialized) {
            this.showToast('Please initialize No-Codes first', 'error');
            return;
        }

        try {
            console.log('🔄 Closing No-Codes...');
            Qonversion.NoCodes.getSharedInstance().close();
            console.log('✅ No-Codes closed');
            this.showToast('No-Codes screen closed', 'success');
        } catch (error) {
            console.error('❌ Close failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    // ==========================================
    // OTHER METHODS
    // ==========================================

    async checkFallbackFile() {
        try {
            this.showLoading();
            console.log('🔄 Checking fallback file accessibility...');
            const accessible = await Qonversion.getSharedInstance().isFallbackFileAccessible();
            console.log('✅ Fallback file accessible:', accessible);
            
            document.getElementById('fallback-result').textContent = `Accessible: ${accessible}`;
            this.showToast(accessible ? 'Fallback file is accessible' : 'Fallback file is not accessible', accessible ? 'success' : 'error');
        } catch (error) {
            console.error('❌ Check fallback file failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    },

    collectAdvertisingId() {
        if (device.platform !== 'iOS') {
            this.showToast('iOS only feature', 'error');
            return;
        }

        try {
            console.log('🔄 Collecting advertising ID...');
        Qonversion.getSharedInstance().collectAdvertisingId();
            console.log('✅ Advertising ID collected');
            this.showToast('Advertising ID collected!', 'success');
        } catch (error) {
            console.error('❌ Collect advertising ID failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    collectAppleSearchAdsAttribution() {
        if (device.platform !== 'iOS') {
            this.showToast('iOS only feature', 'error');
            return;
        }

        try {
            console.log('🔄 Collecting Apple Search Ads attribution...');
        Qonversion.getSharedInstance().collectAppleSearchAdsAttribution();
            console.log('✅ Apple Search Ads attribution collected');
            this.showToast('ASA attribution collected!', 'success');
        } catch (error) {
            console.error('❌ Collect ASA attribution failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    presentCodeRedemptionSheet() {
        if (device.platform !== 'iOS') {
            this.showToast('iOS only feature', 'error');
            return;
        }

        try {
            console.log('🔄 Presenting code redemption sheet...');
        Qonversion.getSharedInstance().presentCodeRedemptionSheet();
            console.log('✅ Code redemption sheet presented');
            this.showToast('Code redemption sheet presented!', 'success');
        } catch (error) {
            console.error('❌ Present code redemption sheet failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    setPromoPurchasesDelegate() {
        if (device.platform !== 'iOS') {
            this.showToast('iOS only feature', 'error');
            return;
        }

        try {
            console.log('🔄 Setting promo purchases delegate...');
            Qonversion.getSharedInstance().setPromoPurchasesDelegate({
                onPromoPurchaseReceived: (productId, promoPurchaseExecutor) => {
                    console.log('📡 Promo purchase received:', productId);
                    this.showToast(`Promo purchase: ${productId}`, 'success');
                    promoPurchaseExecutor();
                }
            });
            console.log('✅ Promo purchases delegate set');
            this.showToast('Delegate set!', 'success');
        } catch (error) {
            console.error('❌ Set promo purchases delegate failed:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    }
};

// Initialize the app
App.initialize();
