import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwriteConfig';
import { Card, ListGroup, Button } from 'react-bootstrap';

const RelatedPosts = ({ keywords, currentPostId }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const parsedKeywords = JSON.parse(keywords);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                if (Array.isArray(parsedKeywords) && parsedKeywords.length > 0) {
                    // Fetch all posts
                    const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e');
                    const allPosts = response.documents;

                    // Filter posts with at least one common keyword and not the current post
                    const filteredPosts = allPosts.filter(post => 
                        post.keywords && JSON.parse(post.keywords).some(keyword => {
                            // console.log(post.$id,";",currentPostId)
                            const isCommon = parsedKeywords.includes(keyword);
                            return isCommon;
                        }) && post.$id !== currentPostId // Exclude the current post
                    );

                    setRelatedPosts(filteredPosts);
                } else {
                    setRelatedPosts([]);
                }
            } catch (error) {
                console.error('Failed to fetch related posts', error);
            }
        };

        fetchRelatedPosts();
    }, [parsedKeywords, currentPostId]);

    const handleReadMore = (postId, views) => {
        // Handle read more action here, e.g., navigate to the post detail page
        // Increment views or perform other actions if needed
    };

    return (
        <Card className="mt-5">
            <Card.Header>Related Posts</Card.Header>
            <ListGroup variant="flush">
                {relatedPosts.length > 0 ? (
                    relatedPosts.map((post) => (
                        <Card key={post.$id} className="mb-3">
                            {post.image && (
                                <Card.Img variant="top" src={post.image} alt={post.title} className="h-25 w-25"/>
                            )}
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
                    ))
                ) : (
                    <ListGroup.Item>No related posts found.</ListGroup.Item>
                )}
            </ListGroup>
        </Card>
    );
};

export default RelatedPosts;
