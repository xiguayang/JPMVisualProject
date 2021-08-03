import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number,
  price_abc: number,
  price_def: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}
//handler for the data from server
//serverResponds are from DataStreamer, index 0 is ABC and 1 is DEF
export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): 
    Row {
      const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
      const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
      const ratio = priceABC/priceDEF;
      //change the thredhold to 2.5% since 10% has fewer ratio could reach
      const upperBound = 1 + 0.025;
      const lowerBound = 1 - 0.025;
    
      return {
        ratio,
        price_abc: priceABC,
        price_def: priceDEF,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio>upperBound||ratio<lowerBound ? ratio : undefined),
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
      }
    }
}