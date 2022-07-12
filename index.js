const asyncHandler = require("./middleware/async");
const domainInfo = require("./utils/domainInfo");
const wordSearch = require("./utils/wordSearch");
const cleanUrl = require("./utils/cleanUrl");

exports.handler = asyncHandler(async (event) => {
  let body = JSON.parse(event.body);
  let url = body.url;

  if (!url) {
    const err = {
      statusCode: 400,
      body: JSON.stringify("url is required"),
    };
    return err;
  } else if (!Array.isArray(body.negativeKeywords)) {
    const err = {
      statusCode: 400,
      body: JSON.stringify(
        "negativeKeywords is required and must be array of strings"
      ),
    };
    return err;
  } else if (!Array.isArray(body.positiveKeywords)) {
    const err = {
      statusCode: 400,
      body: JSON.stringify(
        "positiveKeywords is required and must be array of strings"
      ),
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

    let isInvalidDomain = Object.values(domain).every(
      (x) => x === null || x === ""
    );
    let isInvalidBingSearch =
      positiveKeywords.length == 0 && negativeKeywords.length == 0;

    const responseBody = {
      domain,
      contactUs: contactUs.length > 0,
      privacyPolicy: privacyPolicy.length > 0,
      shoppingCart: shoppingCart.length > 0,
      positiveKeywords,
      negativeKeywords,
    };
    if (isInvalidBingSearch || isInvalidDomain) {
      let errorResponse = {
        success: false,
        error: {
          code: "INVALID_DOMAIN",
          message: "Unable to find domain data",
        },
      };
      var response = {
        statusCode: 400,
        body: JSON.stringify(errorResponse),
      };
    } else {
      var response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
      };
    }

    return response;
  }
});
