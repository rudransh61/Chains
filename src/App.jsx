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
import Logout from './components/Logout';
import UpdatePost from './components/UpdatePost';
import Settings from './components/Settings';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile'; // Import the UserProfile component
import UserSearch from './components/UserSearch';

function App() {
    return (
        <Router>
            <NavBar />
            <Container className="mt-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/my-blogs" element={<UserProfile />} />
                    <Route path="/blog/:id" element={<BlogPostDetail />} />
                    <Route path="/user-search" element={<UserSearch />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/" element={<BlogPosts />} />
                    <Route path="/update-post/:id" element={<UpdatePost />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/user/:userId" element={<UserBlogs />} /> {/* Add route for UserProfile component */}
                </Routes>
            </Container>
            <Footer />
        </Router>
    );
}

export default App;
