# Tweeter Project

Tweeter is a simple, single-page Twitter clone.

This repository is the starter code for the project: Students will fork and clone this repository, then build upon it to practice their HTML, CSS, JS, jQuery and AJAX front-end skills, and their Node, Express and MongoDB back-end skills.

## Screenshots

The tweeter page with the input area visible

!["Screenshot of tweeter with a visible form area"](https://github.com/acdarroll/tweeter/blob/master/docs/visible-form.png?raw=true)

Hidden form

!["Hidden form"](https://github.com/acdarroll/tweeter/blob/master/docs/hidden-form.png?raw=true)

The page with an invalid input error

!["Page with an empty input error"](https://github.com/acdarroll/tweeter/blob/master/docs/overflow-error.png?raw=true)

Hover effects for tweets

!["Hover effects for tweets"](https://github.com/acdarroll/tweeter/blob/master/docs/tweet-hover.png?raw=true)


## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Create the Tweeter database on MongoDB by running the following commands
  - `mongo`
  - `use tweeter`
4. Create a .env file and add the following keys:
  - MONGODB_URI=mongodb://127.0.0.1:27017/tweeter
  - COOKIE_TOKEN=<some string>
5. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
6. Go to <http://localhost:8080/> in your browser.

There will be no tweets when you run the server for the first time.
Click the compose button to toggle the input form.

## Dependencies

- Express
- Node 5.10.x or above
- Body Parser
- Chance
- Express - router
- Md5 - hash usernames into vanillicon image urls
- Mongodb - document database


