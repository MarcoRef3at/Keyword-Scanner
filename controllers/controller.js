const asyncHandler = require("../middleware/async");
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

    res.status(200).json({
      domain,
      contactUs: contactUs.length > 0,
      privacyPolicy: privacyPolicy.length > 0,
      shoppingCart: shoppingCart.length > 0,
      positiveKeywords,
      negativeKeywords
    });
  }
});

const cleanUrl = url => {
  url = url.replace(/\s/g, "");
  url = url.split("http://").pop();
  url = url.split("https://").pop();
  url = url.split("www.").pop();
  url = url.split("http://www.").pop();
  url = url.split("https://www.").pop();
  return url;
};
