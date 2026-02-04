import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const userEmail = localStorage.getItem('userEmail');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <nav className="bg-gray-950 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-evenly">
        <div className="flex items-center justify-evenly space-x-10">
          <Link to="/home" className="text-gradient text-xl font-bold">
            MovieFlix
          </Link>
          <span className="text-white text-sm">
            Welcome, {currentUser.username || userEmail}
          </span>
        </div>
        
        <button
          onClick={onLogout}
          className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;