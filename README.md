# README

## LinkedHeist

This is a simple LinkedIn Post scraper built with Node.js

### Inputs
- Your LinkedIn Session Cookie
- Scraping Depth (1-15)
- LinkedIn User ID of the creator

### Retrieving Cookie

#### Browser-Independent:

* Navigate to Linkedin.com and log in
* Open up the browser developer tools (Ctrl-Shift-I or right click -> inspect element)

#### Chrome:

* Select the Application tab
* Under the Storage header on the left-hand menu, click the Cookies dropdown and select www.linkedin.com
* Find the li_at cookie, and double click the value to select it before copying

#### Firefox:

* Select Storage tab
* Click the Cookies dropdown and select www.linkedin.com
* Find and copy the li_at value


## How to install

Copy the repo from this website, then
In command line:
`$ git clone https://github.com/ghosharnab00/linkedthief-back.git`
`$ cd LinkedHeist`
`$ npm install`
`$ npm start`

At this point you should see the app running


That's it! Your web service will be live on your Render URL as soon as the build finishes.
