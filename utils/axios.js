const axios = require("axios");
const SUBSCRIPTION_KEY = "f9a81dda603b4cab97e7641ae0231f71";

module.exports = axios.create({
  baseURL: "https://api.bing.microsoft.com/v7.0/search?",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY
  }
});
