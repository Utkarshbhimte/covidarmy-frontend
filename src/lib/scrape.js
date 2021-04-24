const { connectToDatabase } = require("./mongo")
const TweetModel = require("../schemas/tweet")
const fetch = require("node-fetch")

const fetchSearchResults = async (newestID, city, searchTerm) => {
  const MAX_RESULTS = 100
  const baseUrl = newestID
    ? `https://api.twitter.com/2/tweets/search/recent?since_id=${newestID}&query=`
    : `https://api.twitter.com/2/tweets/search/recent?query=`
  const url =
    baseUrl +
    `verified ${city} ${searchTerm} -"requirement" -"needed" -"needs" -"need" -"not verified" -"unverified" -"required" -"urgent" -"urgentlyrequired" -"help" -is:retweet -is:reply -is:quote&max_results=${MAX_RESULTS}&tweet.fields=created_at,public_metrics&expansions=author_id`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + process.env.BEARER_TOKEN,
    },
  })
  return response
}

/**
 * @param {Object} tweet
 */
const buildTweetObject = (tweet, city, resource) => {
  return {
    id: tweet.id,
    authorId: tweet.author_id,
    url: `https:www.twitter.com/${tweet.author_id}/status/${tweet.id}`,
    retweetCount: tweet.public_metrics.retweet_count,
    replyCount: tweet.public_metrics.reply_count,
    postedAt: tweet.created_at,
    location: {
      [city]: true,
    },
    resource: {
      ...(Array.isArray(resource)
        ? resource.reduce((acc, cur) => {
            acc[cur] = true
            return acc
          }, {})
        : {
            [resource]: true,
          }),
    },
  }
}

/**
 * @param {Object} params
 * @param {any} [params.newestID]
 * @returns {Promise<void>}
 */
const scrape = async ({ newestID = null }) => {
  const db = await connectToDatabase()
  let totalCalls = 0

  //Ref URL:
  //https://api.twitter.com/2/tweets/search/recent?query=verified mumbai (bed OR beds OR icu OR oxygen OR ventilator OR ventilators OR fabiflu OR remdesivir OR favipiravir OR tocilizumab OR plasma OR tiffin) -"not verified" -"unverified" -"needed" -"required" -"urgent" -"urgentlyrequired" -"help"&max_results=10&tweet.fields=created_at

  const cities = require("../../seeds/cities.json")
  const resources = require("../../seeds/resources.json")

  for (const city in cities) {
    const toSave = []
    let searchTerm = []

    for (let resourceKey in resources) {
      let _searchTerm = resources[resourceKey]
      if (_searchTerm.includes("(")) {
        _searchTerm = _searchTerm.replace(/[()]/g, "")
        if (_searchTerm.includes(" OR ")) {
          _searchTerm = resourceKey.split("OR").map((i) => i.trim())
        }
      }
      if (Array.isArray(_searchTerm)) {
        _searchTerm.forEach((i) => {
          searchTerm.push(i)
        })
      } else {
        searchTerm.push(_searchTerm)
      }
    }

    totalCalls++
    console.log(`Fetching tweets for ${city}\nTotal calls: ${totalCalls}`)
    const validSearchTerm = `(${searchTerm
      .map((i) => i.toLowerCase())
      .join(" OR ")})`
    const response = await fetchSearchResults(newestID, city, validSearchTerm)
    const json = await response.json()

    try {
      if (json.data)
        for (const tweet of json.data) {
          const retweetCount = tweet.public_metrics.retweet_count
          if (retweetCount >= 10) {
            const tweetResources = []
            for (const key of searchTerm) {
              const tweetText = tweet.text.replace(/#(S)/g, " ")
              if (tweetText.text.includes(key)) {
                tweetResources.push(key.toLowerCase())
              }
            }
            const toSaveObject = buildTweetObject(tweet, city, tweetResources)
            if (Object.keys(toSaveObject.resource).length > 0) {
              toSave.push(toSaveObject)
            }
          }
        }
      newestID = json.meta.newest_id
    } catch (error) {
      // if (response.status === 429) {
      //   const json = await response.json()
      //   await new Promise((resolve) => setTimeout(resolve, 1000))
      //   if (json.data)
      //     for (const tweet of json.data) {
      //       const retweetCount = tweet.public_metrics.retweet_count
      //       if (retweetCount >= 10) {
      //         toSave.push(buildTweetObject(tweet, city, resourceKey))
      //       }
      //     }
      // } else {
      console.log(`\n===Error!===\n${error}\n`)
      console.log("Response:", response)
      // }
    }
    console.log(toSave)
    await TweetModel.insertMany(toSave, (err, docs) => {
      if (err) {
        console.log("Error Saving the Documents")
      } else {
        console.log("All Documents Saved!")
      }
    })
  }
  if (!process.env.VERCEL) await db.disconnect()
}

scrape({})
module.exports = scrape
