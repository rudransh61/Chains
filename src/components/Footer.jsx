import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaGithub, FaBlog } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-light navbar navbar-fixed-bottom mt-5">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>About Us</h5>
                        <p>
                            Thanks
                        </p>
                    </Col>
                    <Col md={4}>
                        <h5>Quick Links</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="/" className="text-light">Home</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={4}>
                        <h5>Follow Us</h5>
                        <div className="d-flex">
                            <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                                <FaGithub size={30} />
                            </a>
                            <a href="https://www.dev.to/rudransh61" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                                <FaBlog size={30} />
                            </a>
                            
                        </div>
                    </Col>
                </Row>
                <hr className="bg-light" />
                <Row>
                    <Col className="text-center">
                        <p>&copy; {new Date().getFullYear()} Chains. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
