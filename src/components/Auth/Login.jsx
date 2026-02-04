import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by email
      const user = users.find(u => u.email === formData.email);
      
      if (!user) {
        setErrors({ email: 'No account found with this email' });
        return;
      }
      
      // Check password
      if (user.password !== formData.password) {
        setErrors({ password: 'Invalid password' });
        return;
      }
      
      // If remember me is checked, store user info
      if (formData.rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          username: user.username
        }));
      } else {
        localStorage.removeItem('currentUser');
      }
      
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      
      // Redirect to home
      navigate('/home');
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
        <h2 className="text-center mb-6 text-white">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="flex items-center justify-between">
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
            
            <Link to="/forgot-password" className="text-[#AB8BFF] hover:underline text-sm">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#503697] to-[#9d91bc] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Login
          </button>
          
          <p className="text-center text-gray-100 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#AB8BFF] hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;