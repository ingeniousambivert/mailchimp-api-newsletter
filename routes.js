const express = require("express");
const request = require("request");
const crypto = require("crypto");
const router = express.Router();

// GET Request on INDEX
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/subscribe.html");
});

// POST Request on INDEX
router.post("/", (req, res) => {
  const { firstname, lastname, email } = req.body;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  if (!firstname || !lastname || !email) {
    res.sendFile(__dirname + "/failed.html");
    res.status(400);
  } else {
    if (res.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.status(400);
      res.sendFile(__dirname + "/failed.html");
    }
  }
  const options = {
    url: "https://<DC>.api.mailchimp.com/3.0/lists/{list_id}",
    // Replace with your URL and list ID
    method: "POST",
    headers: {
      Authorization: "auth {api_key}"
      // Replace with your API Key
    },
    body: postData
  };

  request(options, (err, response, body) => {
    console.log(response.statusCode);
    console.log(`POST REQUEST FOR SUBSCRIBE ${body}`);
  });
});

// GET Request on Unsubscribe
router.get("/unsubscribe", (req, res) => {
  res.sendFile(__dirname + "/unsubscribe.html");
});
// PATCH Request on Unsubscribe
router.patch("/unsubscribe", (req, res) => {
  const { email } = req.body;
  const data = {
    status: "unsubscribed"
  };
  const api_email = email.toLowerCase();
  let hash = crypto
    .createHash("md5")
    .update(api_email)
    .digest("hex");

  const JSONData = JSON.stringify(data);

  if (!email) {
    res.sendFile(__dirname + "/failed.html");
    res.status(400);
  } else {
    if (res.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.status(400);
      res.sendFile(__dirname + "/failed.html");
    }
  }
  const options = {
    url: `https://<DC>.api.mailchimp.com/3.0/lists/{list_id}/members/${hash}`,
    method: "PATCH",
    headers: {
      Authorization: "auth api_key"
    },
    body: JSONData
  };

  request(options, (err, response, body) => {
    console.log(response.statusCode);
    console.log(`PATCH REQUEST FOR UNSUBSCRIBE ${body}`);
  });
});

module.exports = router;
