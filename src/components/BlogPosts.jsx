import React, { useState, useEffect } from 'react';
import { databases } from '../appwriteConfig';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e');
                setPosts(response.documents.reverse());
                // setPosts(posts.reverse())
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    const handleReadMore = async (id, views) => {
        try {
            await databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id, {
                views: views + 1,
            });
            history(`/blog/${id}`);
        } catch (error) {
            console.error('Failed to update views', error);
        }
    };

    // Filter and sort posts for latest and most viewed sections
    const latestPosts = posts; // Latest 5 posts
    const mostViewedPosts = posts.slice().sort((a, b) => (b.views || 0) - (a.views || 0)); // Most viewed 5 posts

    return (
        <Container className="mt-5">
            <div className="mt-5">
                <h2 className="mb-5"><u>Latest Blogs</u></h2>
                <div className='m-5'>

                {latestPosts.map((post) => (
                    <Card key={post.$id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.body.slice(0, 100)}...</Card.Text>
                            <Card.Footer className="text-muted">
                                {new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')}
                                {' | '}
                                By-{post.Author}
                                {' | '}
                                Views: {post.views}
                                <Button
                                    className="ms-2"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleReadMore(post.$id, post.views || 0)}
                                >
                                    Read More
                                </Button>
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))}
                </div>
            </div>

            <div className="mt-5">
                <h2 className="mb-5"><u>Most Viewed Blogs of All Time</u></h2>
                <div className='m-5'>

                {mostViewedPosts.map((post) => (
                    <Card key={post.$id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.body.slice(0, 100)}...</Card.Text>
                            <Card.Footer className="text-muted">
                                {new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')}
                                {' | '}
                                By-{post.Author}
                                {' | '}
                                Views: {post.views}
                                <Button
                                    className="ms-2"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleReadMore(post.$id, post.views || 0)}
                                >
                                    Read More
                                </Button>
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))}
                </div>
            </div>
        </Container>
    );
};

export default BlogPosts;
