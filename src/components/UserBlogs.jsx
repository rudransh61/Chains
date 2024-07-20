import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases, account } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const UserBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
                setUserId(user.$id);
                setUserEmail(user.email);
                setUserName(user.name);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchPosts = async () => {
                try {
                    const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e', [
                        Query.equal('Author_id', userId),
                    ]);
                    setPosts(response.documents);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchPosts();
        }
    }, [userId]);

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
        if (confirmDelete) {
            try {
                await databases.deleteDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', postId);
                setPosts(posts.filter(post => post.$id !== postId));
                alert('Post deleted successfully.');
            } catch (error) {
                console.error('Failed to delete post', error);
                alert('Failed to delete post.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        return (
            <Container className="mt-5">
                <h1>You are not logged in yet</h1>
                <p>Please log in to view your blogs.</p>
                <Button as={Link} to="/login" variant="primary">Login</Button>
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
                            <Card.Text><strong>Name:</strong> {userName}</Card.Text>
                            <Card.Text><strong>Email:</strong> {userEmail}</Card.Text>
                            <Card.Text><strong>Total Blogs:</strong> {posts.length}</Card.Text>
                            
                            {/* You can add more profile details as needed */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <h1>My Blogs</h1>
                    
                    {posts.length > 0 ? posts.map((post) => (
                        <Card key={post.$id} className="mb-3">
                            <Card.Body>
                            {post.image && (
                                <Card.Img variant="top" src={post.image} alt={post.title} className="h-25 w-25"/>
                            )}
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.body.slice(0,100)}</Card.Text>
                                <Card.Text>
                                    <small>{new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')} | By-{post.Author} | Views: {post.views}</small>
                                </Card.Text>
                                <Button as={Link} to={`/update-post/${post.$id}`} variant="warning">Edit</Button>
                                <Button
                                    variant="danger"
                                    className="ms-2"
                                    onClick={() => handleDelete(post.$id)}
                                >
                                    Delete
                                </Button>
                                <Button as={Link} to={`/blog/${post.$id}`} className="ms-2" variant="primary" size="sm">Read More</Button>
                                {
                                    !post.ispublic && (
                                        <Button variant="secondary">Private</Button>
                                    )
                                }
                            </Card.Body>
                        </Card>
                    )) : <p>No posts found</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default UserBlogs;
