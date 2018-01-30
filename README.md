# Code Samples

## React/Redux
**Sample Code for:** User signup functionality
**Note(s):** I use socketio for real time responses from server as opposed to the more popular axios framework. Therefore handling responses made more sense in the component layer.
             socket instance is initialized in the main App.js and accessible via React's context.
#### Files
* Webpack config (2.0) - updated config from 1 to 2
* src
	* actions
		* SignUpAction.js - related action calls for signing up
	* constants
		* ActionTypes.js - constant file for action types
	* reducers
		* SignUpReducer.js - state reducer for signing up
	* container
		* SignUpContainer.js - redux wrapper class (container) for the sign up component below. This container provides access to selected actions defined from the actions file, and applicable state(s)
	* component
		* SignUp.js - component that renders the signup modal and handles submission

## Nodejs
**Sample Code for:** User signup functionality
**Note(s):** Did not use any ODM for my db. Calls are simple, only a handful are used for querying could not justify the loss in speed by adding an ODM layer.
             Current build uses Node 6, waiting for Node 8 to come out to implement async / await feature.
			 Use of Logger in application will also send out an email.
			 Bluebird framework used for better promise performance.
#### Files
* database.js - your basic db querying functions
* SignUpAPI.js - sign up socket function called from our frontend to sign up a new user
* extra_meat.js - a small custom enhancement added for function efficiency (pulled segmented code)

## Rails
**Sample Code for:** Feature implementation of cheque feature by user adding / editing requested line items.
#### Files
* Model.rb - simple model
* Controller.rb - example of how I handle rendering & item creation of new feature. (Ordinal isn't supported by default in ruby 1.8.7 so we have to improvise with our own ordinal functions)
* View.rb - design structure and display of my feature implemention
	
## DOTNet
**Sample Code for:** Salesforce integration
**Note(s)**: Took out some sensitive queries.
#### Files
* salesforce.cs - main portion of application. Use of salesforce API for creating orders & order items.
* utility
	* DatTimeExtensions.cs - some extensions I wrote to expand on obtaining certain dates required by the application
