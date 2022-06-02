export type AmplifyDependentResourcesAttributes = {
    "function": {
        "bunglePosts": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "bungleComments": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "bungleappbungleDBLayer": {
            "Arn": "string"
        },
        "bungleappb582a2abPreSignup": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        }
    },
    "api": {
        "bungle": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "auth": {
        "bungleappb582a2ab": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "storage": {
        "bungleDB": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "SortKeyName": "string",
            "SortKeyType": "string",
            "Region": "string"
        },
        "bungleS3": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}