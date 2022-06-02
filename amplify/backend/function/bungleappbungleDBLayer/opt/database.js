const AWS = require('aws-sdk');
const { ulid } = require('ulid'); // better for future sorting

AWS.config.update({ region: 'ca-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "bungleDB";
if (process.env.ENV && process.env.ENV !== "NONE") {
 tableName = tableName + '-' + process.env.ENV;
}

const isPostIndex = "isPost-index"

// const partitionKeyName = "PK"
// const sortKeyName = "SK"
// const invertIndex = "invertedIndex"

async function createUser(username) {
    const Item = {
        username: username,
        PK: "USER#" + username,
        SK: "USER#" + username,
        postCount: 0,
        created: new Date().toISOString()
    }

    let params = {
        TableName: tableName,
        Item
    }
    await dynamodb.put(params).promise()
    return Item
}
exports.createUser = createUser

async function createPost(username, description, imageName) {
    const Item = {
        PK: "USER#" + username,
        SK: "POST#" + ulid(),
        username,
        description,
        imageName,
        created: new Date().toISOString(),
        commentCount: 0,
        isPost: "true"
    }

    let createParams = {
        TableName: tableName,
        Item: Item
    }

    let updateParams = {
        TableName: tableName,
        Key: {
            PK: "USER#" + username,
            SK: "USER#" + username,
        },
        UpdateExpression: "SET postCount = postCount+ :inc",
        ExpressionAttributeValues: {
            ":inc": 1
        }
    }

    await dynamodb.put(createParams).promise()
    await dynamodb.update(updateParams).promise()

    return Item
}
exports.createPost = createPost

async function createComment(username, postId, text) {
    const Item = {
        PK: "POST#" + postId,
        SK: "COMMENT#" + ulid(),
        username,
        text,
        created: new Date().toISOString(),
    }

    let params = {
        TableName: tableName,
        Item
    }

    let updateParams = {
        TableName: tableName,
        Key: {
            PK: "USER#" + username,
            SK: "POST#" + postId,
        },
        UpdateExpression: "SET commentCount = commentCount+ :inc",
        ExpressionAttributeValues: {
            ":inc": 1
        }
    }

    await dynamodb.put(params).promise()
    await dynamodb.update(updateParams).promise()

    return Item
}
exports.createComment = createComment

async function getPost(username, postId) {
    let params = {
        TableName: tableName,
        Key: {
            PK: "USER#" + username,
            SK: "POST#" + postId
        }
    }

    const result = await dynamodb.get(params).promise()
    return result
}
exports.getPost = getPost

async function getPostsByUser(username) {
    let params = {
      TableName: tableName,
      KeyConditions: {
        PK: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ["USER#" + username]
        },
        SK: {
          ComparisonOperator: 'BEGINS_WITH', // [IN, NULL, BETWEEN, LT, NOT_CONTAINS, EQ, GT, NOT_NULL, NE, LE, BEGINS_WITH, GE, CONTAINS]
          AttributeValueList: ["POST#"]
        }
      },
      ScanIndexForward: false
    }
  
    const result = await dynamodb.query(params).promise()
    return result
}
exports.getPostsByUser = getPostsByUser

async function getPosts() {
    console.log("called getPosts on database")
    let params = {
        TableName: tableName,
        IndexName: isPostIndex,
        KeyConditions: {
            isPost: {
                ComparisonOperator: "EQ",
                AttributeValueList: ["true"],
            },
        },
        ScanIndexForward: false,
    };

    const result = await dynamodb.query(params).promise()
    return result
}
exports.getPosts = getPosts

async function deletePost(username, postId) {
    console.log("called deletePosts on database")
    let params = {
        ReturnValues: 'ALL_OLD',
        TableName: tableName,
        Key: {
            PK: "USER#" + username,
            SK: "POST#" + postId
        }
        }
        try {
            const result = await dynamodb.delete(params).promise()
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
            return error
        }
}
exports.deletePost = deletePost

async function updatePost(username, postId, description) {
    let updateParams = {
        TableName: tableName,
        Key: {
            PK: "USER#" + username,
            SK: "POST#" + postId,
        },
        UpdateExpression: "SET description = :newDescription",
        ExpressionAttributeValues: {
            ":newDescription": description,
        },
        ReturnValues: "UPDATED_NEW",
    }
    try {
        console.log(postId, description)
        const result = await dynamodb.update(updateParams).promise()
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}
exports.updatePost = updatePost