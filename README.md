# Demo ml streamr
prediction app with ARIMA.

## Introduction
Application is using [streamr](https://streamr.network/) platform to connect with Binance API, currently with stream id `binance-streamr.eth/ETHUSDT/trades`, then training and prediction of subsequent values ​​using machine learning model ARIMA are performed on the data set and shown on html page. Prediction can help you make trading decisions.

## Features

List the key features of your project. This section can help users quickly understand what your project can do.

- fetch data from binance
- train and predict using ARIMA model
- show data on chart 

## Getting Started

clone this repository, go to `server` folder and type `npm install` and than `npm star` to run project on `localhost:3000`. Open `index.html` with live server extension if you are using visual studio code editor.

### Prerequisites

you need need private key from metamask wallet, create and put PRIVATE_KEY variable in .env file.

```bash
Node.js
install Live Server extension in visual studio code
```
### Installation

```bash
git clone ..
cd server

create .env file
provide PRIVATE_KEY=yourkey, to be able to verify access to streamr network

npm install
npm start
```

### Terminology

Streamr is a fully decentralised and scalable protocol for many to many data pipelines, network analytics and instant messaging.

ARIMA. Time-series forecasting in browsers and Node.js https://www.npmjs.com/package/arima . ARIMA stands for "AutoRegressive Integrated Moving Average." It is a widely used time series forecasting method in statistics and econometrics. ARIMA models are used to analyze and forecast time series data, which is data collected or recorded over a sequence of time intervals. 
ARIMA models are defined by three parameters: p, d, and q, which correspond to the AR, I, and MA components, respectively. The model aims to capture patterns and relationships in the time series data to make accurate forecasts. ARIMA models are particularly useful for handling time series data with trends and seasonality.

In summary, ARIMA is a mathematical framework for time series forecasting that combines autoregressive, differencing, and moving average components to model and predict future values in a time series. It has been applied in various fields, including finance, economics, and environmental science, to analyze and forecast data with a temporal structure.
