/* Amplify Params - DO NOT EDIT
	AUTH_BUNGLEAPPB582A2AB_USERPOOLID
	ENV
	REGION
	STORAGE_BUNGLEDB_ARN
	STORAGE_BUNGLEDB_NAME
	STORAGE_BUNGLEDB_STREAMARN
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const database = require('/opt/database.js')

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

var cors = require('cors');
app.use(cors());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  if('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next()
  }
});


const AWS = require('aws-sdk')

// const bucketName = "bungles3bucket"

async function getAuthUser(req) {
  const authProvider = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider
  console.log({authProvider})
  if (!authProvider) {
    return
  }
  const parts = authProvider.split(':');
  const poolIdParts = parts[parts.length - 3];
  if (!poolIdParts) {
    return 
  }
  const userPoolIdParts = poolIdParts.split('/');

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const listUsersResponse = await cognito.listUsers({
      UserPoolId: userPoolId,
      Filter: `sub = "${userPoolUserId}"`,
      Limit: 1,
    }).promise();

  const user = listUsersResponse.Users[0];
  return user
}


/**********************
 * Example get method *
 **********************/

app.get('/posts', async function(req, res) {
  try {
    // const authUser = await getAuthUser(req)
    let posts = await database.getPosts()
    posts.Items = posts.Items.map(post => {
      return {
        ...post,
        id: post.SK.replace("POST#", "")
      }
    })
    res.send(posts)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});

app.get('/posts/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/posts', async function(req, res) {
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  try {
    const user = await getAuthUser(req);
    const result = await database.createPost(user.Username, description, imageUrl);
    res.send(result)
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/posts/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/posts', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/posts/:id', async function(req, res) {
  const description = req.body.description
  const postId = req.body.postId

  console.log(description, postId)

  try {
    const user = await getAuthUser(req);
    const result = await database.updatePost(user.Username, postId, description);
    res.send(result)
  } catch (error) {
    res.status(500).send(error);
  }
});

/****************************
* Example delete method *
****************************/

app.delete('/posts', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/posts/:id', async function(req, res) {
  const postId = req.params.id
  try {
    const user = await getAuthUser(req);
    const result = await database.deletePost(user.Username, postId);
    res.send(result)
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
