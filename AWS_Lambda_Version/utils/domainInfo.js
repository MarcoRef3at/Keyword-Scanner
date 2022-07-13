const whoiser = require("whoiser");
const sslChecker = require("ssl-checker");
const ipInfo = require("ip-info-finder");
const { convertIso2Code } = require("convert-country-codes");

module.exports = domainInfo = async url => {
  var serverAddress = "";
  var serverAddressISO = "";
  try {
    ipInfo
      .getIPInfo(url)
      .then(data => {
        // console.log("data:", data);
        serverAddress = data.city
          ? `${data.city}, ${convertIso2Code(data.countryCode).iso3}`
          : "";
        serverAddressISO = data.countryCode
          ? convertIso2Code(data.countryCode).iso3
          : "";
      })
      .catch(err => console.log("serverAddress Error", err));
    try {
      var domainWhois = await whoiser(url);
      // console.log("domainWhois:", domainWhois);
    } catch (error) {
      console.log("errrrror:", error);
    }
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
          Country =
            Country != "" &&
            Country.length < 3 &&
            convertIso2Code(Country).iso3;
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
      locationISO: Country,
      serverAddress,
      serverAddressISO,
      httpsValidation: https.valid
    };

    return domain;
  } catch (error) {
    console.log("error:", error);
    return [];
  }
};