import React, { useState, useEffect } from 'react';
import { databases, account } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Card } from 'react-bootstrap';

const UserBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUserId(user.$id);
            } catch (error) {
                console.error(error);
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

    return (
        <Container className="mt-5">
            <h2>My Blogs</h2>
            {posts.map((post) => (
                <Card key={post.$id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.body}</Card.Text>
                        <Card.Footer className="text-muted">{new Date(post.date_time).toLocaleString()}</Card.Footer>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default UserBlogs;
