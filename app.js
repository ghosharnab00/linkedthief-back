const express = require("express");
const puppeteer = require('puppeteer');
const {
  scrollPageToBottom
} = require('puppeteer-autoscroll-down')
const depth = 2;
const userID = 'iamarnabghosh';



const app = express();
const port = process.env.PORT || 3001;

app.get("/", async(req, res) => {
  
  
  req.setTimeout(0);
    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        //   '--start-maximized'
        ]
      });
    const page = await browser.newPage();
  
    await page.setViewport({
      width: 1366,
      height: 768
  });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

  await page.setCookie({
      'name': 'li_at',
      'value': 'AQEDATXjEK0DGIznAAABg_bu1A4AAAGEGvtYDk0AebaHffeQhwSK1-bkVg-kBSZY3Qxrs_RW5kzx8ZN40owwlznk69AdTwXpzS3LWgkYmwBzEsrycKOGqzk3gD0HHNxH-PWI7A3QvWgWqOcSjUDDZa7R',
      'domain': 'www.linkedin.com'
  });


  await page.goto(`https://www.linkedin.com/in/${userID}/recent-activity/shares/`);

  await browser.close();
  










  res.status(200).json({status:'on'})


});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

