import React, { useState } from 'react';
import { account, databases } from '../appwriteConfig';
import { Container, Form, Button } from 'react-bootstrap';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Create user account
            const user = await account.create('unique()', email, password, name);

            // Add user details to the userdata collection
            await databases.createDocument('667a93ab0015408da08b', '66a23a28002f30b04ca2', user.$id, {
                name: user.name,
                id: user.$id
            });

            alert('Signup successful!');
        } catch (error) {
            console.error(error);
            alert('Signup failed! (User already exists or make sure password >= 8 characters long)');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Sign up for Chains</h2>
            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Signup</Button>
            </Form>
        </Container>
    );
};

export default Signup;
