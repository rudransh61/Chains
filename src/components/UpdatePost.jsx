import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases, account } from '../appwriteConfig';
import { Container, Form, Button } from 'react-bootstrap';
import { marked } from 'marked'; // Import marked library

const UpdatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const user = await account.get();
                const response = await databases.getDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id);
                if (response.Author !== user.name) {
                    setError('You are not authorized to update this post.');
                    setLoading(false);
                } else {
                    setTitle(response.title);
                    setBody(response.body);
                    setCoverImageUrl(response.image || '');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch post', error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            await databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id, {
                title,
                body,
                image: coverImageUrl,
            });
            alert('Post updated successfully!');
            navigate('/my-blogs');
        } catch (error) {
            console.error('Failed to update post', error);
            alert('Failed to update post!');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Function to convert Markdown to HTML
    const renderMarkdown = (markdown) => {
        const html = marked(markdown);
        return { __html: html };
    };

    return (
        <Container className="mt-5">
            <h2>Update Post</h2>
            <Form onSubmit={handleUpdatePost}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
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
                        placeholder="Enter body"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cover Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="Enter cover image URL"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Post</Button>
            </Form>
            <div className="mt-5">
                <h3>Markdown Preview</h3>
                <div
                    className="preview"
                    dangerouslySetInnerHTML={renderMarkdown(body)}
                />
            </div>
        </Container>
    );
};

export default UpdatePost;
