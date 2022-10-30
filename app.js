require('dotenv').config()
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

const {
  scrollPageToBottom
} = require('puppeteer-autoscroll-down')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const searchDepth = readlineSync.question('How deep you want to scrape? (Give answer from 1 to 10)? ');
const LinkedInuserID = readlineSync.question('Enter the LinkedIn User name. Example: "arnab-ghosh" ');;

// console.log(depth, userID )
const LinkedThief = async( depth, userID)=>{

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
      'value': process.env.COOKIE,
      'domain': 'www.linkedin.com'
  });


  await page.goto(`https://www.linkedin.com/in/${userID}/recent-activity/shares/`);
  for (i = 0; i < depth; i++) {
    const lastPosition = await scrollPageToBottom(page, {
        size: 400,
        delay: 250
    })
    console.log(`page ${i+1} scraping done`)
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
                    
                    const socialCount = postElem.querySelector(".social-details-social-counts__reactions-count").innerText || 0;
                    const socialComments = postElem.querySelector('.social-details-social-counts__comments').innerText || 0;
                    posts.push({
                        posttext,
                        // img,
                        socialCount,
                        socialComments
                    });
                } catch (e) {}
            }
            return posts;
        });

        console.log('POSTS Scraped: ', allposts.length);
        // console.log( allposts);
        const csvWriter = createCsvWriter({
    path:  `./output/${userID}_linkedin_posts.csv`,
    header: [
        {id: 'posttext', title: 'POST_TEXT'},
        // {id: 'img', title: 'IMAGE'},
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

LinkedThief(searchDepth, LinkedInuserID)

// process.exit();
