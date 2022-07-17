const whoiser = require("whoiser");
const sslChecker = require("ssl-checker");
const { convertIso2Code } = require("convert-country-codes");
const dns = require("dns");
const iplocate = require("node-iplocate");

module.exports = domainInfo = async (url) => {
  return new Promise((resolve, reject) => {
    try {
      dns.resolve4(url, async (err, addresses) => {
        if (err) {
          console.err("dns error", err);
          throw `dns error ${err}`;
        }
        var ip = addresses[0];
        var result = await iplocate(ip);
        var serverAddress = `${result.country}, ${result.country_code}`;
        var serverAddressISO = result.country_code;

        serverAddress = result.city
          ? `${result.city}, ${convertIso2Code(result.country_code).iso3}`
          : "";

        serverAddressISO = result.country_code
          ? convertIso2Code(result.country_code).iso3
          : "";
        try {
          var domainWhois = await whoiser(url);
        } catch (error) {
          console.log("domainWhois errrrror:", error);
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
          httpsValidation: https.valid,
        };
        console.log("domain:", domain);
        resolve(domain);
      });
    } catch (error) {
      console.log("error:", error);
      resolve([]);
    }
  });
};
