import React, { useState, useRef } from 'react';
import { account } from '../appwriteConfig';
import { Container, Form, Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const recaptchaRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const captchaValue = recaptchaRef.current.getValue();
        if (!captchaValue) {
            alert('Please verify the reCAPTCHA!');
            return;
        }

        try {
            await account.createEmailPasswordSession(email, password);
            alert('Login successful!');
        } catch (error) {
            console.error(error);
            alert('Login failed!');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Login to Chains</h2>
            <Form onSubmit={handleLogin}>
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
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_APP_SITE_KEY}
                />
                <Button variant="primary" type="submit" className="mt-3">Login</Button>
            </Form>
        </Container>
    );
};

export default Login;
