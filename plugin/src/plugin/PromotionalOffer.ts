import {SKProductDiscount} from './SKProductDiscount';
import {SKPaymentDiscount} from './SKPaymentDiscount';

export class PromotionalOffer {
    public readonly productDiscount: SKProductDiscount;
    public readonly paymentDiscount: SKPaymentDiscount;

    constructor (
        productDiscount: SKProductDiscount,
        paymentDiscount: SKPaymentDiscount
    ) {
        this.productDiscount = productDiscount;
        this.paymentDiscount = paymentDiscount;
    }
}
