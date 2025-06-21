import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AllCourses from './pages/Allcourses';
import Faculty from './pages/Faculty';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ContactAdmin from './pages/ContactAdmin';

import StudentLayout from './modules/Student/StudentLayout';
import FacultyLayout from './modules/Faculty/FacultyLayout';
import AdminLayout from './modules/Admin/AdminLayout';

const App = () => {
  const checkAuthState = () => ({
    isAdminLoggedIn: sessionStorage.getItem('admin') !== null,
    isFacultyLoggedIn: sessionStorage.getItem('faculty') !== null,
    isStudentLoggedIn: sessionStorage.getItem('student') !== null
  });

  const [authState, setAuthState] = useState(checkAuthState);

  const handleLogout = (role) => {
    sessionStorage.removeItem(role);
    const newAuthState = {
      isAdminLoggedIn: false,
      isFacultyLoggedIn: false,
      isStudentLoggedIn: false
    };
    
    setAuthState(newAuthState);
    setTimeout(() => {
      setAuthState(checkAuthState());
    }, 100);
  };
  
  useEffect(() => {
    const checkAuth = () => {
      const currentAuthState = checkAuthState();
      const stateChanged = 
        currentAuthState.isAdminLoggedIn !== authState.isAdminLoggedIn ||
        currentAuthState.isFacultyLoggedIn !== authState.isFacultyLoggedIn ||
        currentAuthState.isStudentLoggedIn !== authState.isStudentLoggedIn;
      
      if (stateChanged) {
        setAuthState(currentAuthState);
      }
    };
    checkAuth();
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('authStateChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, [authState]);

  return (
    <Router>
      <Routes>
        {authState.isStudentLoggedIn ? (
          <Route path="/student/*" element={<StudentLayout onLogout={() => handleLogout('student')}/>} />
        ) : null}

        {authState.isFacultyLoggedIn ? (
          <Route path="/faculty/*" element={<FacultyLayout onLogout={() => handleLogout('faculty')}/>}/>
        ) : null}

        {authState.isAdminLoggedIn ? (
          <Route path="/admin/*" element={<AdminLayout onLogout={() => handleLogout('admin')}/>}/>
        ) : null}

        {!authState.isAdminLoggedIn && !authState.isFacultyLoggedIn && !authState.isStudentLoggedIn ? (
          <>
            <Route path="/" element={<Landing setAuthState={setAuthState}/>}/>
            <Route path="/courses" element={<AllCourses setAuthState={setAuthState}/>} />
            <Route path="/facultys" element={<Faculty setAuthState={setAuthState}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/contactadmin" element={<ContactAdmin />} />
          </>
        ) : null}
        
        <Route path="*" element={
          authState.isAdminLoggedIn ? <Navigate to="/admin/home/dashboard" replace /> :
          authState.isFacultyLoggedIn ? <Navigate to="/faculty/home/dashboard" replace /> :
          authState.isStudentLoggedIn ? <Navigate to="/student/home/dashboard" replace /> :
          <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;