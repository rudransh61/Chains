import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import AddPost from './components/AddPost';
import BlogPosts from './components/BlogPosts';
import UserBlogs from './components/UserBlogs';
import BlogPostDetail from './components/BlogPostDetail';
import Logout from './components/Logout'; // Import the Logout component
import UpdatePost from './components/UpdatePost'

function App() {
    return (
        <Router>
            <NavBar />
            <Container className="mt-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/my-blogs" element={<UserBlogs />} />
                    <Route path="/blog/:id" element={<BlogPostDetail />} />
                    <Route path="/logout" element={<Logout />} /> {/* Add route for Logout component */}
                    <Route path="/" element={<BlogPosts />} />
                    <Route path="/update-post/:id" element={<UpdatePost />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
