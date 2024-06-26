import React, { useState } from 'react';
import { databases } from '../appwriteConfig';
import { getUser } from '../utils/user';
import { ID } from 'appwrite';
import { Container, Form, Button } from 'react-bootstrap';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleAddPost = async (e) => {
        e.preventDefault();
        try {
            const user = await getUser();
            // console.log(user)
            if (user) {
                const response = await databases.createDocument(
                    '667a93ab0015408da08b', 
                    '667a93b3003d6bf2802e', 
                    ID.unique(),
                    {
                        title,
                        body,
                        Author: user.name,
                        date_time: new Date().toJSON().slice(0,10).replace(/-/g,'/')
                    },
                    undefined
                );
                // console.log(response);
                alert('Post added successfully!');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add post!');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Add New Post</h2>
            <Form onSubmit={handleAddPost}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Body"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add Post</Button>
            </Form>
        </Container>
    );
};

export default AddPost;
