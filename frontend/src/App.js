import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './router/ProtectedRoute';
import './App.css';

function App() {

  return (

    // <AuthContext.Provider>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/register" element={<Register />} />
    //       <Route path="/dashboard" element={
    //         <ProtectedRoute><Dashboard /></ProtectedRoute>
    //       } />
    //     </Routes>
    //   </Router>
    // </AuthContext.Provider>

    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </div>

  );
}

export default App;
