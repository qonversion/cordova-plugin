import {ProductPrice} from "./ProductPrice";

/**
 * This class contains all the information about the Google in-app product details.
 */
export class ProductInAppDetails {
  /**
   * The price of an in-app product.
   */
  price: ProductPrice;

  constructor(price: ProductPrice) {
    this.price = price;
  }
}
