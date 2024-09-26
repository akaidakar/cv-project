import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUser } from '../context/UserContext';

export default function Navbar() {
	const { isAuthenticated, token, logout: authLogout } = useAuth();
	const { user, logout: userLogout } = useUser();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			if (authLogout) authLogout();
			if (userLogout) await userLogout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<nav className="bg-primary text-primary-foreground">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link to="/" className="text-2xl font-bold">
					My Blog
				</Link>
				<div className="space-x-4">
					<Button variant="ghost" asChild>
						<Link to="/posts">Posts</Link>
					</Button>
					<Button variant="ghost" asChild>
						<Link to="/premium">Premium</Link>
					</Button>
					{isAuthenticated ? (
						<>
							{user?.username ? (
								<span>Welcome, {user.username}</span>
							) : (
								<span>Welcome, Guest</span>
							)}
							<Button variant="secondary" onClick={handleLogout}>
									Sign Out
							</Button>
						</>
					) : (
						<Button variant="secondary" asChild>
							<Link to="/login">Login</Link>
						</Button>
					)}
				</div>
			</div>
		</nav>
	);
}