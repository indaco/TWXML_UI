# TWXML_UI
## ThingWorx Machine Learning Experimental UI for Workers

--------------------------------------------------------------------------------
### Disclaimer
This is not an official PTC or ThingWorx solution. It's a personal development on top of ThingWorx Machine Learning. PTC and ThingWorx are not responsible for it.

_PTC, the PTC logo, ThingWorx and the ThingWorx logo are trademarks or registered trademarks of PTC Inc. or its subsidiaries in the United States and in other countries._

--------------------------------------------------------------------------------

### Introduction
[ThingWorx Machine Learning](http://www.thingworx.com/machine-learning) is a powerful advanced and predictive analytics engine for ThingWorx developers. Few know how to create, operationalize, and maintain advanced and predictive intelligence. That's why we've built powerful machine learning technology inside the ThingWorx platform – to automate these complex processes.

ThingWorx Machine Learning enables developers to easily:
- Build solutions that include predictive analytics
- Scale advanced analytics to the largest datasets
- Integrate proactive intelligence into any ThingWorx-powered solution

all without having to be an expert in data science or complex mathematics.

Further information are available on the [Official ThingWorx Web Site](http://www.thingworx.com/machine-learning)

### What this project is about?
The goal of this project is to provide an easy and fast tool to start any kind of project with ThingWorx Machine Learning as a standalone advanced analytic engine. Be focused on the job, learn more on ThingWorx Machine Learning doing your job and avoid wasted time.

So it lets you:
- read the API documentation in order to understand how you need to start
- avoid using Postman for calling the ThigWorx ML REST APIs
- avoid wasting time for fixing the REST API body instead of focusing on what you are trying to achieve in terms of analytics
- look for a single and easy way to understand the meaning of input parameters
- ...

#### Features
- HTML5 user interface built with ExpressJS, Bootstrap and JQuery
- Inline help for input fields
- _Live_ form validation
- Auto-detect analysis goals
- Easy creation of Filters and reuse of them in other jobs
- Check jobs status with one click
- Retrieve job results with one click
- Glossary:
  - Add, update or delete entries editing the `app_server/public/glossary_dictionary.json` file

*Current version (v.0.2.0) doesn't fully cover TWXML APIs*: Postman or similar are still required if you want to do something like:
- Filters creations and usage
- Scoring
- Prescriptive job and results
- Predictive evaluation

Next version will include additional features. Remember that you can always add features and share with the team :-)

### How to use it?
Please refer to the *HOWTO.md* file into the *docs* folder

#### Credits
(2015) Idea and development by Mirco Veltri; released under [CC0 1.0 Universal](http://creativecommons.org/publicdomain/zero/1.0/) license.
