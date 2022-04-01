const asyncHandler = require("../middleware/async");
const cleanUrl = require("../utils/cleanUrl");
const domainInfo = require("../utils/domainInfo");
const ErrorResponse = require("../utils/errorResponse");
const wordSearch = require("../utils/wordSearch");

// @des         Get All data
// @route       POST /endpoint
// @access      Private/Admin
exports.getAll = asyncHandler(async (req, res, next) => {
  url = cleanUrl(req.body.url);

  if (!url) {
    return next(new ErrorResponse("url is required", 400));
  } else if (!Array.isArray(req.body.negativeKeywords)) {
    return next(
      new ErrorResponse(
        "negativeKeywords is required and must be array of strings",
        400
      )
    );
  } else if (!Array.isArray(req.body.positiveKeywords)) {
    return next(
      new ErrorResponse(
        "positiveKeywords is required and must be array of strings",
        400
      )
    );
  } else {
    let domain = await domainInfo(url);

    let positiveKeywords = await wordSearch(url, req.body.positiveKeywords);
    let negativeKeywords = await wordSearch(url, req.body.negativeKeywords);
    let contactUs = await wordSearch(url, ["Contact Us"]);
    let privacyPolicy = await wordSearch(url, ["Privacy", "Policy"]);
    let shoppingCart = await wordSearch(url, ["Shopping Cart"]);

    let isInvalidDomain = Object.values(domain).every(
      x => x === null || x === ""
    );
    let isInvalidBingSearch =
      positiveKeywords.length == 0 && negativeKeywords.length == 0;

    let response = {
      domain,
      contactUs: contactUs.length > 0,
      privacyPolicy: privacyPolicy.length > 0,
      shoppingCart: shoppingCart.length > 0,
      positiveKeywords,
      negativeKeywords
    };

    if (isInvalidBingSearch || isInvalidDomain) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_DOMAIN",
          message: "Unable to find domain data"
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: response
      });
    }
  }
});
