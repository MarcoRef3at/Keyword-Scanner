const axios = require("./axios");

const objectCleaner = searchResult => {
  searchResult.map((o, i) => {
    searchResult[i] = {
      url: searchResult[i].url,
      snippet: searchResult[i].snippet,
      dateLastCrawled: searchResult[i].dateLastCrawled
    };
  });

  return searchResult;
};

const axiosSearch = async (url, word) => {
  return new Promise((resolve, reject) => {
    let search = `site:${url} "${word}"`;
    path = `/v7.0/search`;
    // path = `/v7.0/search?q=${search}&responseFilter=webPages`;
    axios
      .get(path, { params: { q: search } })
      .then(res => {
        // console.log("res.data:", res.data);
        let searchResult = res.data.webPages;
        if (searchResult) {
          let finalResult = objectCleaner(searchResult.value);
          resolve(finalResult);
        } else {
          resolve(null);
        }
      })
      .catch(e => {
        reject(e);
        console.log("e:", e);
      });
  });
};

module.exports = wordSearch = async (url, words) => {
  try {
    let foundWords = words.map(async word => {
      return axiosSearch(url, word)
        .then(x => {
          if (x != null) return { keyword: word, results: x };
        })
        .catch(err => {
          console.log("err:", err);
        });
    });
    foundWords = await Promise.all(foundWords);
    let foundClearedWords = foundWords.filter(n => n);
    return foundClearedWords;
  } catch (error) {
    return "could not find";
  }
};
