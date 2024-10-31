import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import Unverified from './components/Unverified';
import PostEvent from './components/Postevent';
import Profile from './components/Profile';
import Verified from './components/Verified';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/main' element={<Main />} />
          <Route path='/unverified' element={<Unverified />} />
          <Route path='/postevent' element={<PostEvent />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/verified' element={<Verified />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
