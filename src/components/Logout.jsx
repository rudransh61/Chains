import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { account } from '../appwriteConfig';

const Logout = () => {
    const history = useNavigate();

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            localStorage.removeItem('appwriteToken'); // Remove the token from localStorage
            history.push('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <div className="mt-5">
            <h2>Logging out...</h2>
            <p>Click the button below to logout.</p>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
