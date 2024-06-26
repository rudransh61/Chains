import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases, account } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const UserBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
                // console.log(user)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUserId(user.name);
                setUserEmail(user.email);
                // console.log(user)
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
                        Query.equal('Author', userId),
                    ]);
                    setPosts(response.documents);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchPosts();
        }
    }, [userId]);

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
                            <Card.Text><strong>Name:</strong> {userId}</Card.Text>
                            <Card.Text><strong>Email:</strong> {userEmail}</Card.Text>
                            <Card.Text><strong>Total Blogs:</strong> {posts.length}</Card.Text>
                            {/* You can add more profile details as needed */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <h1>My Blogs</h1>
                    {posts.map((post) => (
                        <Card key={post.$id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.body}</Card.Text>
                                <Card.Text><small>{new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')}| By-{post.Author} 
                                | Views : {post.views}</small></Card.Text>
                                <Button as={Link} to={`/update-post/${post.$id}`} variant="warning">Edit</Button>
                                <Link to={`/blog/${post.$id}`}>
                                    <Button className="ms-2" variant="primary" size="sm">Read More</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );

};

export default UserBlogs;
