import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked'; // Import marked library
import { databases, account } from '../appwriteConfig';
import { Container, Card } from 'react-bootstrap';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUserId(user.name);
            } catch (error) {
                console.error(error);
            }
        };

        getUser();
    }, []);

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

    // Function to convert Markdown to HTML
    const renderMarkdown = (markdown) => {
        const html = marked(markdown);
        return { __html: html };
    };

    return (
        <Container className="mt-5">
            <h2>{post.title}</h2>
            <Card className="mb-3">
                {post.image && (
                    <Card.Img variant="top" src={post.image} alt={post.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                )}
                <Card.Body>
                    {/* Render Markdown content */}
                    <Card.Text dangerouslySetInnerHTML={renderMarkdown(post.body)} />
                    <Card.Footer className="text-muted">
                        {new Date(post.date_time).toISOString().slice(0, 10).replace(/-/g, '/')}
                    </Card.Footer>
                    <Card.Footer className="text-muted">
                        By - {post.Author}
                    </Card.Footer>
                    <Card.Footer className="text-muted">
                        Views - {post.views}
                    </Card.Footer>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BlogPostDetail;
