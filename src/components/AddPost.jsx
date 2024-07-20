import React, { useState } from 'react';
import { databases } from '../appwriteConfig';
import { getUser } from '../utils/user';
import { ID } from 'appwrite';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const handleAddPost = async (e) => {
        e.preventDefault();
        try {
            const user = await getUser();
            if (user) {
                await databases.createDocument(
                    '667a93ab0015408da08b', 
                    '667a93b3003d6bf2802e', 
                    ID.unique(),
                    {
                        title,
                        body,
                        image: coverImageUrl, // Add cover image URL here
                        Author: user.name,
                        date_time: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
                        Author_id: user.$id,
                        ispublic : isPublic // Add the isPublic field here
                    }
                );
                alert('Post added successfully!');
                // Clear form fields after successful submission
                setTitle('');
                setBody('');
                setCoverImageUrl('');
                setIsPublic(false);
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
                        rows={5}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Body"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cover Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="Cover Image URL"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Publish as public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add Post</Button>
            </Form>
            <Row className="mt-5">
                <Col md={6}>
                    <h3>Markdown Preview</h3>
                    <ReactMarkdown>{body}</ReactMarkdown>
                </Col>
                <Col md={6}>
                    <h3>Cover Image Preview</h3>
                    {coverImageUrl && <img src={coverImageUrl} alt="Cover" style={{ width: '100%' }} />}
                </Col>
            </Row>
        </Container>
    );
};

export default AddPost;
