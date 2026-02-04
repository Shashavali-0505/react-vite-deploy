import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = `Passwords doesn't match`;
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.some(user => user.email === formData.email)) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // If remember me is checked, store user info
      if (formData.rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify({
          email: formData.email,
          username: formData.username
        }));
      } else {
        localStorage.removeItem('currentUser');
      }
      
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Redirect to login
      navigate('/login');
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="pattern absolute w-full h-full z-0" />
      <div className="relative z-10 bg-dark-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-center mb-6 text-white">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-100 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full bg-light-100/5 px-4 py-3 rounded-lg text-white placeholder-gray-100 ${
                errors.username ? 'border border-red-500' : ''
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-100 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-light-100/5 px-4 py-3 rounded-lg text-white placeholder-gray-100 ${
                errors.email ? 'border border-red-500' : ''
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-100 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-light-100/5 px-4 py-3 rounded-lg text-white placeholder-gray-100 ${
                errors.password ? 'border border-red-500' : ''
              }`}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-100 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-light-100/5 px-4 py-3 rounded-lg text-white placeholder-gray-100 ${
                errors.confirmPassword ? 'border border-red-500' : ''
              }`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-100">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-linear-to-r from-[#61489f] to-[#9c91b9] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign Up
          </button>
          
          <p className="text-center text-gray-100 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#AB8BFF] hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;