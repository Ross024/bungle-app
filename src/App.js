import './App.css'
import '@aws-amplify/ui-react/styles.css';

// import { Amplify } from 'aws-amplify';
import * as amplify from './amplify';
import { Authenticator, Button, Card, Flex, Heading, Icon, Image, Text, TextField } from '@aws-amplify/ui-react';
import { FaEllipsisH, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import CreateForm from './components/CreateForm';

// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

// const apiName = "bungle";

function App() {
  const [posts, setPosts] = useState([])
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ postId: '', description: '' })

  useEffect(() => {
    getPosts()
  }, [])

  async function getPosts() {
    const posts = await amplify.getAllPosts()
    setPosts(posts)
  }

  async function deletePost(postId) {
    const deleteRequest = await amplify.deletePost(postId)
    console.log(`Delete request for post ${postId}`)

    const posts = await amplify.getAllPosts()
    setPosts(posts)
    return deleteRequest
  }

  const handleEdit = async (e) => {
    e.preventDefault();

    await amplify.editPost(editData.postId, editData.description)

    const posts = await amplify.getAllPosts()
    setPosts(posts)
    setEditing(false)
}

  
  return (
    <div className="App">
      
      <Authenticator>
      {({ signOut, user }) => (
        <div className='landing-page'>
          <h1>Bungle</h1>
          <nav>
            <Button variation="menu" onClick={() => setCreating((e) => !e)}>Create New Post</Button>
            <h2>Hello {user.username}</h2>
            <Button variation="menu" onClick={signOut}>Sign Out</Button>
          </nav>
          {creating ? (
            <CreateForm setPosts={setPosts} />) : null
          }
          {posts.map(post => (
            <Card variation="elevated" key={post.id} maxWidth="70%" margin="10px auto">
              <Flex direction="column">
                <Flex direction="row" justifyContent="space-between">
                  <Heading level={5}>{post.username}</Heading>
                  <div className="icon-container">
                    <div className="icon" onClick={() => setEditing((e) => !e)}><FaEllipsisH /></div>
                    <div className="icon" onClick={() => deletePost(post.id)}><FaTrashAlt /></div>
                  </div>
                </Flex>
                <Image src={post.imageName} />
                <Text>{post.description}</Text>
                {editing ? (
                  <form autoComplete="off" noValidate onSubmit={handleEdit}>
                    <Flex>
                      <TextField autoComplete="off" descriptiveText="Edit your description" placeholder={post.description} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value, postId: post.id })}></TextField>
                      <Button variation="secondary" type="submit">Submit</Button>
                    </Flex>
                  </form>
                ) : null}
              </Flex>
            </Card>
          ))}
        </div>
      )}
      </Authenticator>
    </div>
  );
}

export default App;
