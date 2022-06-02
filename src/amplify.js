import Amplify, { API, Storage } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports)

const apiName = "bungle"

function randomString(bytes = 16) {
    return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b =>
        b.toString(16)).join("")
}

export async function uploadImage(file) {
    const result = await Storage.put(randomString(), file)
    return result
}

export async function getImage(name) {
    const url = await Storage.get(name)
    return url
}

// POSTS QUERIES
export async function getAllPosts() {
    const path = "/posts"
    const result = await API.get(apiName, path) //get method
    console.log("get all posts for all users", result)
    return result.Items
}

export async function createPost(description, imageName) {
    const path = "/posts"
    const imageUrl = `https://bungles3bucket204048-dev.s3.ca-central-1.amazonaws.com/public/${imageName}`

    const result = await API.post(apiName, path, {
        body: { description, imageUrl }
    })
    console.log("create a new post", result)
    return result
}

export async function deletePost(postId) {
    const path = `/posts/${postId}`

    const result = await API.del(apiName, path)
    console.log("delete post", result)

    return result
}

export async function editPost(postId, description) {
    const path = `/posts/${postId}`

    const result = await API.put(apiName, path, {
        body: { postId, description }
    })
    console.log("update post", result)
    
    return result
}