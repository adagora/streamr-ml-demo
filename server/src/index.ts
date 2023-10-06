import * as process from "process";
const StreamrClient = require("streamr-client");
const ARIMA = require("arima");
import express from "express";
import { attachTimestamp, rmse } from "./utils";
import { BiananceMessageWithPrediction } from "./interfaces";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

const PORT = 3000;
const BINANCE_STREAMR_ID = "binance-streamr.eth/ETHUSDT/trades";
const DATA_BUFFER_SIZE = 100;
const PREDICTION_STEPS_FORWARD = 30;
const LOSS_THRESHOLD = 20;

const streamr = new StreamrClient({
  auth: {
    privateKey: process.env.PRIVATE_KEY,
  },
});

const arimaModel = new ARIMA({
  method: 0, // ARIMA method (Default: 0)
  optimizer: 6, // Optimization method (Default: 6)
  p: 2, // Number of Autoregressive coefficients
  d: 1, // Number of times the series needs to be differenced
  q: 2, // Number of Moving Average Coefficients
  s: 11, // Seasonal lag
  P: 1, // Number of seasonal Autoregressive coefficients
  D: 1, // Number of seasonal times the series needs to be differenced
  Q: 1, // Number of seasonal Moving Average Coefficients
  verbose: false, // Output model analysis to console
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let dataBuffer: number[] = [];
let dataBufferAfterArima: BiananceMessageWithPrediction[] = [];

streamr.subscribe(
  BINANCE_STREAMR_ID,
  (message: BiananceMessageWithPrediction) => {
    const attachTimestampToObj = attachTimestamp(message);

    // TRAIN AND PREDICT
    const priceData = message.price;
    dataBuffer.push(priceData);

    if (dataBuffer.length === DATA_BUFFER_SIZE) {
      arimaModel.fit(dataBuffer);
      // Predict the next 30 steps forward
      const [pred, errors] = arimaModel.predict(PREDICTION_STEPS_FORWARD);
      // compute average price from pred
      const sum = pred.reduce((a: number, b: number) => a + b, 0);
      const avgPred = sum / pred.length;

      const predictionTimestamp = new Date().toISOString();

      // compute average errors
      const sumError = errors.reduce((a: number, b: number) => a + b, 0);
      const avgError = sumError / errors.length;

      const loss = rmse(pred, dataBuffer);

      dataBuffer = [];

      if (loss > LOSS_THRESHOLD) {
        return;
      }

      const attachPredictionsToObj = {
        ...attachTimestampToObj,
        predictionErrors: avgError,
        predictionPrice: avgPred,
        predictionLoss: loss,
        predictionTimestamp: predictionTimestamp,
      };

      console.log("attachPredictionsToObj", attachPredictionsToObj);

      dataBufferAfterArima.push(attachPredictionsToObj);

      app.get(`/api/tradesWithArimaPredictions`, (_, res) => {
        res.send(dataBufferAfterArima);
      });
    }
  }
);
