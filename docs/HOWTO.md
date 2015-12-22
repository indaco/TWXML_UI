# TWXML_UI

## How to use it?
TWXML_UI is built on top of NodeJS, using ExpressJS framework, Boostrap and JQuery.

Don't worry, to start using it you just have to install nodejs on your local machine and follow the simple instructions below.

It not takes you more the 10 minute to be productive with ThingWorx Machine Learning.

### IMPORTANT CONSIDERATION
Before to start, make sure Google Chrome is installed on your PC.

TWXML_UI tool uses Google Chrome as the only browser tested due the fact that it requires a Google Chrome plugin in order to avoid CORS error. The only task that requires this plugin is the **CSV file upload (Upload dataset)**.
Others task can be accomplished using other browsers like IE 10 or later version as well as  Mozilla Firefox.

(_I haven't had time for code refactoring in order to remove this limitation._)


Once Google Chrome is installed on your PC go to the [Chrome Web Store](https://chrome.google.com/webstore/search/cors?hl=en-US&utm_source=chrome-ntp-launcher) and search for **cors**. Install the **Allow-Control-Allow-Origin: *** extension.

![chrome_web_store](images/chrome_store.png)

After that open a new tab and enable CORS extension just installed before to use TWXML_UI tool

![enable_cors](images/enable_cors.png)

Now you can proceed to the newxt session.
**Remember** to enable the CORS plugin in a new blank tab of Google Chrome before the start working with the tool.

### Step-by-Step installation on your PC
Here a step-by-step guide to configure and start using TWXML_UI:
1. Download and install [NodeJS](https://nodejs.org/en/)
2. Download this project
3. Open and Edit the `config/default.json` file with your information
4. Open a shell / cmd window and move to the path where you save this project
5. Type `npm install` in order to install all the dependency
6. Start the server typing:
  - `node bin\www` for Windows users
  - `node bin/www` for Linux or OSX users

7. Open a browser window and go to [http://localhost:3000](http://localhost:3000)


### Step-by-Step installation on Neuron-solo VM
It is possible to deploy TWXML_UI directly on the Neuron VM instead to install it on your local computer. To do it follow instructions below:

1. Install dependencies on the VM
  - Run the NeuronSolo VM and log-in
  - Install prerequisites typing `sudo yum install net-tools gcc gcc-c++ make`
  - Download and install NodeJS from sources in order to use the latest version:
```shell
[vagrant@neuron ]$ wget https://nodejs.org/dist/latest/node-v5.3.0.tar.gz
[vagrant@neuron ]$ tar xvzf node-v5.3.0.tar.gz
[vagrant@neuron ]$ cd node-v5.3.0
[vagrant@neuron ]$ ./configure
[vagrant@neuron ]$ make
[vagrant@neuron ]$ make install
```
  - Check everything works fine typing `node --version` and `npm --version`
2. See instructions for _Step-by-Step installation on your PC_ above excluding **step 1**