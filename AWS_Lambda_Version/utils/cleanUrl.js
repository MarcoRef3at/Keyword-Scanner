module.exports = cleanUrl = url => {
  url = url.replace(/\s/g, "");
  url = url.split("http://").pop();
  url = url.split("https://").pop();
  url = url.split("www.").pop();
  url = url.split("http://www.").pop();
  url = url.split("https://www.").pop();
  return url;
};
