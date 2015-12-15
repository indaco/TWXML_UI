# TWXML_UI
## Experimental UI for working with ThingWorx Machine Learning

--------------------------------------------------------------------------------

### Disclaimer
This is not an official PTC or ThingWorx solution. It's a personal development on top of ThingWorx Machine Learning. PTC and ThingWorx are not responsible of it.

_PTC, the PTC logo, ThingWorx and the ThingWorx logo are trademarks or registered trademarks of PTC Inc. or its subsidiaries in the United States and in other countries._

--------------------------------------------------------------------------------

### Introduction
[ThingWorx Machine Learning](http://www.thingworx.com/machine-learning) is a Powerful advanced and predictive analytics engine for ThingWorx developers Few know how to create, operationalize, and maintain advanced and predictive intelligence. That's why we've built powerful machine learning technology inside the ThingWorx platform – to automate these complex processes.

ThingWorx Machine Learning enables developers to easily:
- Build solutions that include predictive analytics
- Scale advanced analytics to the largest of datasets
- Integrate proactive intelligence into any ThingWorx-powered solution

All without having to be an expert in data science or complex mathematics.

Further information are available on the [Official ThingWorx Web Site](http://www.thingworx.com/machine-learning)

### What this project is about?
The goal of this project is to provide an easy and fast tool to start any kind of project with ThingWorx Machine Learning as a standalone advanced analytic engine. Be focused on the job, learn more on ThingWorx Machine Learning doing your job and avoid wasted time.

So it let you to:
- read the API documentation in order to understand what you need to start
- use Postman writing Javascript objects to call a REST APIs
- waste time to fixing the REST API body instead to be focused on what you are trying to achieve in terms of analytics
- look for a single and easy way to know what input paramenters mean for ThingWorx Machine Learning
- ...

#### Features
- HTML5 user interface built with ExpressJS, Bootstrap and JQuery
- Inline help for input fields
- _Live_ form validation
- Auto-detect analysis goals
- Easily creation of Filters and reuse them in other jobs
- check jobs status directly with one click
- Glossary

### How to use it?
TWXML_UI is built on top of NodeJS, using ExpressJS framework, Boostrap and JQuery.

Don't worry, to start using it you jast have to install nodejs on your local machine and follow the simple instructions below.

It not takes you more the 10 minute to be productive with ThingWorx Machine Learning.

#### Step-by-Step installation guide
1. Download and install [NodeJS](https://nodejs.org/en/)
2. Download this project
3. Open and Edit the `config/default.json` file with your information
4. Open a shell / cmd window and move to the path where you save this project
5. Type `npm install` in order to install all the dependency
6. Start the server typing:
  - `bin\start.bat` for Windows users
  - `bin/start.sh` for Linux or OSX users

7. Open a browser window and visit [http://localhost:3000](http://localhost:3000)

### Contributing
If you are interested in more features or in fixing something and you havee experience with Javascript and ExpressJS, feel free to contribute.

How to do it?
- Fork it
- Create your feature branch (git checkout -b my-new-feature)
- Commit your changes (git commit -am 'Add some feature')
- Push to the branch (git push origin my-new-feature)
- Create new Pull Request

### Credits
Idea and development by me, Mirco.
