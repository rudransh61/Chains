import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router for navigation
import { account, databases } from '../appwriteConfig';
import { Query } from 'appwrite';
import { Container, Form, Button } from 'react-bootstrap';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState(''); // Added state for bio
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
                setName(user.name);
                setEmail(user.email);

                // Fetch user details including bio
                const response = await databases.listDocuments('667a93ab0015408da08b', '66a23a28002f30b04ca2', [
                    Query.equal('id', user.$id),
                ]);

                if (response.documents.length > 0) {
                    setBio(response.documents[0].bio || '');
                }

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
            await updateUserDetails(name, bio); // Pass bio to the updateUserDetails function
            alert('Name updated successfully');
        } catch (error) {
            console.error('Failed to update name', error);
            alert('Failed to update name');
        }
    };

    const updateBlogAuthors = async (newName) => {
        try {
            const response = await databases.listDocuments('667a93ab0015408da08b', '667a93b3003d6bf2802e', [
                Query.equal('Author_id', user.$id),
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

    const updateUserDetails = async (newName, newBio) => {
        try {
            const response = await databases.listDocuments('667a93ab0015408da08b', '66a23a28002f30b04ca2', [
                Query.equal('id', user.$id),
            ]);

            if (response.documents.length > 0) {
                const updatePromises = response.documents.map((document) => 
                    databases.updateDocument('667a93ab0015408da08b', '66a23a28002f30b04ca2', document.$id, {
                        name: newName,
                        bio: newBio,
                    })
                );
                await Promise.all(updatePromises);
            } else {
                // Create a new document if no existing documents found
                await databases.createDocument('667a93ab0015408da08b', '66a23a28002f30b04ca2', {
                    // user_id: user.$id,
                    name: newName,
                    bio: newBio,
                });
            }
        } catch (error) {
            console.error('Failed to update user details', error);
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

    const handleUpdateBio = async (e) => {
        e.preventDefault();
        try {
            await updateUserDetails(name, bio); // Update user details with bio
            alert('Bio updated successfully');
        } catch (error) {
            console.error('Failed to update bio', error);
            alert('Failed to update bio');
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

            <Form onSubmit={handleUpdateBio} className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter your bio"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Bio</Button>
            </Form>
        </Container>
    );
};

export default Settings;
