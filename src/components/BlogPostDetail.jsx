import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databases } from '../appwriteConfig';
import { Container, Card } from 'react-bootstrap';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await databases.getDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id);
                setPost(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) {
        return <Container>Loading...</Container>;
    }

    return (
        <Container className="mt-5">
            <h2>{post.title}</h2>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Text>{post.body}</Card.Text>
                    <Card.Footer className="text-muted">{new Date(post.date_time).toLocaleString()}</Card.Footer>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BlogPostDetail;
