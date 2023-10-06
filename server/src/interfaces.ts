export interface BiananceMessageWithPrediction {
  symbol: string;
  price: number;
  quantity: number;
  maker: boolean;
  timestamp: string;
  predictionErrors: number;
  predictionPrice: number;
  predictionLoss: number;
  predictionTimestamp: string;
}
