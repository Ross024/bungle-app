import React, { useState } from 'react';
import { Button, Card, Flex, TextField, View, useTheme } from '@aws-amplify/ui-react';
import * as amplify from '../amplify';


const CreateForm = ({ setPosts }) => {
    const { tokens } = useTheme();
    const [postData, setPostData] = useState({ description: '', selectedFile: '', })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await amplify.uploadImage(postData.selectedFile);
        const imageName = result.key

        await amplify.createPost(postData.description, imageName)

        const posts = await amplify.getAllPosts()
        setPosts(posts)

        clear();
    }

    const clear = () => {
        setPostData({ description: '', selectedFile: '', })
    }

    return (
        <View
            backgroundColor={tokens.colors.background.secondary}
            padding={tokens.space.medium}
        >
            <Card maxWidth="70%" margin="0 auto">
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Flex direction="column">
                        <TextField label="Description" name="description" value={postData.description} onChange={(e) => setPostData({ ...postData, description: e.target.value })} />
                        <input type="file" accept="image/*" onChange={(e) => setPostData({ ...postData, selectedFile: e.target.files[0]})} />
                        <Button variation="primary" type="submit">Submit</Button>
                    </Flex>
                </form>
            </Card>
        </View>
    )
}

export default CreateForm;