# mDevTools

## LINTER
### Npm install

Open a terminal inside the "mDevTools" folder and run the command:
````
$ npm install
````
Run this command to start the application
````
$ node src/main.js
````

### Settings
All settings can be found in the ".mirrorrc" file in the "mDevTools" folder.

_Files starting with a "." are by default hidden in OSX_ 
`````
{
	"dir": [
		"./examples/**/*.js",
		"!src/gui/node_modules"
	],
	"tests": [
		"./test/**/*.js"
	],
	"gui": true,
	"watch": true,
	"output": "./report.json",
	"verbose": true
}
````
Ignore files and folders by adding a "!" infront of the path
````
"!src/gui/node_modules"
````


## GUI 
### Gulp install
Open a terminal inside the "src/gui" folder and run the command:
````
$ npm install gulp -g
````

After that run:
````
$ gulp
````

