import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwriteConfig';
import { Container, Form, ListGroup, Card, Button } from 'react-bootstrap';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await databases.listDocuments('667a93ab0015408da08b', '66a23a28002f30b04ca2');
                setAllUsers(response.documents);
                setFilteredUsers(response.documents); // Initially show all users
            } catch (error) {
                console.error('Failed to fetch users', error);
                alert('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const results = allUsers.filter(user => 
            user.name.toLowerCase().includes(term)
        );
        setFilteredUsers(results);
    };

    return (
        <Container className="mt-5">
            <h1>Search Users</h1>
            <Form.Group className="mb-3">
                <Form.Label>Search by Name</Form.Label>
                <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Enter name"
                />
            </Form.Group>

            {loading ? <div>Loading...</div> : (
                <ListGroup className="mt-4">
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <Card key={user.$id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{user.name}</Card.Title>
                                <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                                <Card.Text><strong>Bio:</strong> {user.bio}</Card.Text>
                                <Button as={Link} to={`/user/${user.id}`} variant="primary">View Profile</Button>
                            </Card.Body>
                        </Card>
                    )) : <p>No users found</p>}
                </ListGroup>
            )}
        </Container>
    );
};

export default UserSearch;
