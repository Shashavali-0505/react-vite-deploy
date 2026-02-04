import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Navbar from './components/Navbar'; // We'll create this next

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};


const Home = () => {
  const [searchTerm,setSearchTerm] = useState('')
  const [errorMessage,setErrorMessage] = useState('')
  const [movieList,setMovieList] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on app load
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/login');
  };
  

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(()=> setDebouncedSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies = async ( query = '') => {
    setIsLoading(true);
    setErrorMessage('')
    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint,API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      console.log(data);

      if(data.Respone == 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [])

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    }
    catch(error){
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies. Please try again later.`);
    }
    finally{
      setIsLoading(false);
    }
  }
  
  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  return (
    <main>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      
      <div className='pattern'/>
      <div className='wrapper'>

        <header>
          
          <img src='./logo.png' alt="hero-logo" className='w-[50px] h-[50px]' />
          <h1 className='text-gradient'>MovieFlix</h1>
          
          <img src="./hero.png" alt='Hero Banner' className='w-[650px] h-[350px]'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>

          <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}  />
        </header>


        <section className='all-movies'>
          <h2 className="mt-[50px]">All Movies</h2>


          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

        </section>
      </div>
    </main>
  )
}





const App = () => {
  
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App