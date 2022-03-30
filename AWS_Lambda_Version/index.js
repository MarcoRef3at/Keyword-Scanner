const asyncHandler = require("./middleware/async");
const domainInfo = require("./utils/domainInfo");
const wordSearch = require("./utils/wordSearch");
const cleanUrl = require("./utils/cleanUrl");

exports.handler = asyncHandler(async event => {
  let body = JSON.parse(event.body);
  let url = body.url;

  if (!url) {
    const err = {
      statusCode: 400,
      body: JSON.stringify("url is required")
    };
    return err;
  } else if (!Array.isArray(body.negativeKeywords)) {
    const err = {
      statusCode: 400,
      body: JSON.stringify(
        "negativeKeywords is required and must be array of strings"
      )
    };
    return err;
  } else if (!Array.isArray(body.positiveKeywords)) {
    const err = {
      statusCode: 400,
      body: JSON.stringify(
        "positiveKeywords is required and must be array of strings"
      )
    };
    return err;
  } else {
    url = cleanUrl(body.url);
    let domain = await domainInfo(url);

    let positiveKeywords = await wordSearch(url, body.positiveKeywords);
    let negativeKeywords = await wordSearch(url, body.negativeKeywords);
    let contactUs = await wordSearch(url, ["Contact Us"]);
    let privacyPolicy = await wordSearch(url, ["Privacy", "Policy"]);
    let shoppingCart = await wordSearch(url, ["Shopping Cart"]);
    console.log("111111111111111111", contactUs);
    const responseBody = {
      domain,
      contactUs: contactUs.length > 0,
      privacyPolicy: privacyPolicy.length > 0,
      shoppingCart: shoppingCart.length > 0,
      positiveKeywords,
      negativeKeywords
    };
    const response = {
      statusCode: 200,
      body: JSON.stringify(responseBody)
    };
    return response;
  }
});
