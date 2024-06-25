import React, { useState, useEffect } from 'react';
import { databases } from '../appwriteConfig';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e');
                setPosts(response.documents);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Container className="mt-5">
            <h2>Blog Posts</h2>
            {posts.map((post) => (
                <Card key={post.$id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.body.slice(0, 100)}...</Card.Text>
                        <Card.Footer className="text-muted">
                            {new Date(post.date_time).toLocaleString()}
                            <Link to={`/blog/${post.$id}`}>
                                <Button className="ms-2" variant="primary" size="sm">Read More</Button>
                            </Link>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default BlogPosts;
