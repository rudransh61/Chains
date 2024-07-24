import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases, account } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchUserPosts = async () => {
                try {
                    const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e', [
                        Query.equal('Author_id', userId),
                    ]);
                    setPosts(response.documents);
                } catch (error) {
                    console.error('Failed to fetch user posts', error);
                }
            };

            fetchUserPosts();
        }
    }, [userId]);

    if (loading) {
        return <Container>Loading...</Container>;
    }

    if (!user) {
        return (
            <Container className="mt-5">
                <h1>User not found</h1>
                <p>Could not fetch the user details.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Profile</Card.Title>
                            <Card.Text><strong>Name:</strong> {user.name}</Card.Text>
                            <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                            <Card.Text><strong>Total Blogs:</strong> {posts.length}</Card.Text>
                            
                            {/* You can add more profile details as needed */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                <h1>{user.name}'s Blogs</h1>
                    
                    {posts.length > 0 ? posts.map((post) => (
                        post.Author_id === userId && (
                            <Card key={post.$id} className="mb-3">
                                <Card.Body>
                                    {post.image && (
                                        <Card.Img variant="top" src={post.image} alt={post.title} className="h-25 w-25"/>
                                    )}
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.body.slice(0, 100)}</Card.Text>
                                    <Card.Text>
                                        <small>{new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')} | By-{post.Author} | Views: {post.views}</small>
                                    </Card.Text>
                                    <Button as={Link} to={`/blog/${post.$id}`} className="ms-2" variant="primary" size="sm">Read More</Button>
                                    {
                                        !post.ispublic && (
                                            <Button variant="secondary" className="ms-2">Private</Button>
                                        )
                                    }
                                </Card.Body>
                            </Card>
                        )
                    )) : <p>No posts found</p>}
                    
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;