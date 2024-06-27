import React, { useState, useEffect } from 'react';
import { account, databases } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Form, Button } from 'react-bootstrap';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
                setName(user.name);
                setEmail(user.email);
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            await account.updateName(name);
            await updateBlogAuthors(name);
            alert('Name updated successfully');
        } catch (error) {
            console.error('Failed to update name', error);
            alert('Failed to update name');
        }
    };

    const updateBlogAuthors = async (newName) => {
        try {
            // Fetch all blogs written by the current user
            const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e', [
                Query.equal('Author', user.name),
            ]);

            const updatePromises = response.documents.map((document) => 
                databases.updateDocument('667a93ab0015408da08b', '667a93b3003d6bf2802e', document.$id, {
                    Author: newName,
                })
            );

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Failed to update blog authors', error);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        try {
            await account.updateEmail(email, password);
            alert('Email updated successfully');
        } catch (error) {
            console.error('Failed to update email', error);
            alert('Failed to update email');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <h1>Settings</h1>
            <Form onSubmit={handleUpdateName} className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter new name"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Name</Button>
            </Form>

            <Form onSubmit={handleUpdateEmail} className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter new email"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Email</Button>
            </Form>
        </Container>
    );
};

export default Settings;
