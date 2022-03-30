const whoiser = require("whoiser");
const sslChecker = require("ssl-checker");

module.exports = domainInfo = async url => {
  try {
    const domainWhois = await whoiser(url);
    // console.log("domainWhois:", domainWhois);
    var City = "";
    var State = "";
    var Country = "";
    var createdAt = "";
    var expiresAt = "";
    var whoIsID = "";

    // Loop over the domains related to the site
    for (const [key, value] of Object.entries(domainWhois)) {
      // Loop over each domain keys and find the key name that contains required data
      for (const [ky, val] of Object.entries(value)) {
        if (ky.includes("City")) {
          City = City == "" ? `${val}, ` : City;
        }
        if (ky.includes("State/Province")) {
          State = State == "" ? `${val}, ` : State;
        }
        if (ky.includes("Country")) {
          Country = Country == "" ? `${val}` : Country;
        }
        if (ky.includes("Created Date")) {
          createdAt = createdAt == "" ? `${val}` : createdAt;
        }
        if (ky.includes("Expiry Date")) {
          expiresAt = expiresAt == "" ? `${val}` : expiresAt;
        }
        if (ky.includes("Registry Domain ID")) {
          whoIsID = whoIsID == "" ? `${val}` : whoIsID;
        }
      }
    }
    try {
      var https = await sslChecker(url);
    } catch (error) {
      var https = { valid: "" };
    }

    let domain = {
      createdAt: createdAt,
      expiresAt: expiresAt,
      whoIsID: whoIsID,
      location: City + State + Country,
      httpsValidation: https.valid
    };

    return domain;
  } catch (error) {
    console.log("error:", error);
    return "Unable to find domain data";
  }
};
