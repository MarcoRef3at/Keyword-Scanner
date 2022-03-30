const axios = require("axios");
const SUBSCRIPTION_KEY = process.env["AZURE_SUBSCRIPTION_KEY"];

module.exports = axios.create({
  baseURL: "https://api.bing.microsoft.com/v7.0/search?",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY
  }
});
