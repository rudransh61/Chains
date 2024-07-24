import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked'; // Import marked library
import { databases, account } from '../appwriteConfig';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon
} from 'react-share';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');

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
                const postComments = response.comments ? JSON.parse(response.comments) : [];
                setComments(Array.isArray(postComments) ? postComments : []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const updatedComments = [...comments, { user: userId, text: newComment, date: new Date().toISOString() }];
        try {
            await databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id, {
                comments: JSON.stringify(updatedComments),
            });
            setComments(updatedComments);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const handleEditComment = (index) => {
        setEditingComment(index);
        setEditedCommentText(comments[index].text);
    };

    const handleUpdateComment = async (index) => {
        const updatedComments = comments.map((comment, i) =>
            i === index ? { ...comment, text: editedCommentText } : comment
        );
        try {
            await databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id, {
                comments: JSON.stringify(updatedComments),
            });
            setComments(updatedComments);
            setEditingComment(null);
            setEditedCommentText('');
        } catch (error) {
            console.error('Failed to update comment', error);
        }
    };

    const handleDeleteComment = async (index) => {
        const updatedComments = comments.filter((_, i) => i !== index);
        try {
            await databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', id, {
                comments: JSON.stringify(updatedComments),
            });
            setComments(updatedComments);
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    if (!post) {
        return <Container>Loading...</Container>;
    }

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

            <div className="mb-3">
                <h3>Share this post:</h3>
                <FacebookShareButton url={window.location.href} quote={post.title}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={window.location.href} title={post.title}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={window.location.href} title={post.title}>
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
            </div>

            <h3>Comments</h3>
            <ListGroup className="mb-3">
                {comments.length > 0 ? comments.map((comment, index) => (
                    <ListGroup.Item key={index}>
                        <strong>{comment.user}</strong> - {new Date(comment.date).toLocaleString()}
                        {editingComment === index ? (
                            <Form className="mt-2" onSubmit={(e) => { e.preventDefault(); handleUpdateComment(index); }}>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    required
                                />
                                <Button variant="success" size="sm" className="mt-2" type="submit">
                                    Update
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-2 ms-2"
                                    onClick={() => setEditingComment(null)}
                                >
                                    Cancel
                                </Button>
                            </Form>
                        ) : (
                            <>
                                <p dangerouslySetInnerHTML={renderMarkdown(comment.text)} />
                                {comment.user === userId && (
                                    <div>
                                        <Button variant="warning" size="sm" onClick={() => handleEditComment(index)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDeleteComment(index)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </ListGroup.Item>
                )) : <p>No comments yet.</p>}
            </ListGroup>

            <Form onSubmit={handleAddComment}>
                <Form.Group className="mb-3">
                    <Form.Label>Add a Comment</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Enter your comment"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add Comment</Button>
            </Form>
        </Container>
    );
};

export default BlogPostDetail;
