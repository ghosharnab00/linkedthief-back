// const express = require("express");
const puppeteer = require('puppeteer');
const {
  scrollPageToBottom
} = require('puppeteer-autoscroll-down')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const depth = 10;
const userID = 'shreya-pattar';



// const app = express();
// const port = process.env.PORT || 3001;

// app.get("/", async(req, res) => {
//   req.setTimeout(0);

const scraper = async()=>{

  let launchOptions = { headless: true, args: ['--start-maximized'],  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' };
 
  const browser = await puppeteer.launch(launchOptions);
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
  for (i = 0; i < depth; i++) {
    const lastPosition = await scrollPageToBottom(page, {
        size: 400,
        delay: 250
    })
    console.log('scroll done')
    await page.waitForTimeout(1000);
}

const extractPosts = async () => {
    try {
        const allposts = await page.evaluate(() => {
            let posts = [];
            const allpostElements = document.querySelectorAll('.occludable-update');
            const postsElemLen = allpostElements.length;

            for (let i = 0; i < postsElemLen; i++) {
                try {
                    const postElem = allpostElements[i];
                    const posttext = postElem.querySelector(".feed-shared-update-v2__description-wrapper").innerText;
                    const img = postElem.querySelector("img").src || '';
                    const socialCount = postElem.querySelector(".social-details-social-counts__reactions-count").innerText || 0;
                    const socialComments = postElem.querySelector('.social-details-social-counts__comments').innerText || 0;
                    posts.push({
                        posttext,
                        img,
                        socialCount,
                        socialComments
                    });
                } catch (e) {}
            }
            return posts;
        });

        console.log('POSTS Scraped: ', allposts.length);
        console.log( allposts);
        const csvWriter = createCsvWriter({
    path:  `${userID}_linkedin_posts.csv`,
    header: [
        {id: 'posttext', title: 'POST_TEXT'},
        {id: 'img', title: 'IMAGE'},
        {id: 'socialCount', title: 'SOCIAL_COUNT'},
        {id: 'socialComments', title: 'SOCIAL_COMMENTS'},
    ]
});
 
csvWriter.writeRecords(allposts)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
    } catch (e) {
        console.error("Unable to extract persons data", e);
    }
};

extractPosts();

}

scraper()
// const csvWriter = createCsvWriter({
//     path:  `${userID}_linkedin_posts.csv`,
//     header: [
//         {id: 'posttext', title: 'POST_TEXT'},
//         {id: 'img', title: 'IMAGE'},
//         {id: 'socialCount', title: 'SOCIAL_COUNT'},
//         {id: 'socialComments', title: 'SOCIAL_COMMENTS'},
//     ]
// });
 
// const records = allposts;
 
// csvWriter.writeRecords(records)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });
  
//   res.status(200).json(await extractPosts())


// });

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

