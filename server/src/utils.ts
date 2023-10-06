import { BiananceMessageWithPrediction } from "./interfaces";

export function attachTimestamp(message: BiananceMessageWithPrediction) {
  const timestamp = new Date().toISOString();
  const messageWithTimestamp = {
    ...message,
    timestamp: timestamp,
  };
  return messageWithTimestamp;
}

export function mse(yt: any, yp: any) {
  return yt.reduce(
    (a: any, v: any, i: any) => a + Math.pow(v - yp[i], 2) / yt.length,
    0
  );
}

export function rmse(yt: any, yp: any) {
  return Math.sqrt(mse(yt, yp));
}
