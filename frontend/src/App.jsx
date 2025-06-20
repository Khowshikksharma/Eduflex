import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AllCourses from './pages/AllCourses';
import Faculty from './pages/Faculty';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ContactAdmin from './pages/ContactAdmin';

import StudentLayout from './modules/Student/StudentLayout';
import FacultyLayout from './modules/Faculty/FacultyLayout';
import AdminLayout from './modules/Admin/AdminLayout';

const App = () => {
  const TIMEOUT_DURATION = 1 * 60 * 1000;
  const timeoutRef = useRef(null);
  const [authState, setAuthState] = useState({
    isAdminLoggedIn: false,
    isFacultyLoggedIn: false,
    isStudentLoggedIn: false
  });

  const checkAuthState = useCallback(() => {
    try {
      const now = Date.now();
      let expiredRole = null;
      const roles = ['admin', 'faculty', 'student'];
      const newAuthState = { isAdminLoggedIn: false, isFacultyLoggedIn: false, isStudentLoggedIn: false };

      roles.forEach(role => {
        const data = sessionStorage.getItem(role);
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.loginTime && (now - parsedData.loginTime) > TIMEOUT_DURATION) {
              expiredRole = role;
            } else {
              newAuthState[`is${role.charAt(0).toUpperCase() + role.slice(1)}LoggedIn`] = true;
            }
          } catch (e) {
            console.error(`Error parsing ${role} data:`, e);
            sessionStorage.removeItem(role);
          }
        }
      });

      if (expiredRole) {
        sessionStorage.removeItem(expiredRole);
      }

      return newAuthState;
    } catch (error) {
      console.error('Error in checkAuthState:', error);
      return {
        isAdminLoggedIn: false,
        isFacultyLoggedIn: false,
        isStudentLoggedIn: false
      };
    }
  }, [TIMEOUT_DURATION]);

  const updateLastActivity = useCallback((role) => {
    try {
      const userData = sessionStorage.getItem(role);
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.lastActivity = Date.now();
        sessionStorage.setItem(role, JSON.stringify(parsedData));
      }
    } catch (e) {
      console.error('Error updating last activity:', e);
    }
  }, []);

  const getCurrentRole = useCallback(() => {
    if (sessionStorage.getItem('admin')) return 'admin';
    if (sessionStorage.getItem('faculty')) return 'faculty';
    if (sessionStorage.getItem('student')) return 'student';
    return null;
  }, []);

  const getTimeRemaining = useCallback(() => {
    try {
      const role = getCurrentRole();
      if (!role) return 0;

      const userData = sessionStorage.getItem(role);
      if (!userData) return 0;

      const parsedData = JSON.parse(userData);
      const lastActivity = parsedData.lastActivity || parsedData.loginTime;
      if (!lastActivity) return 0;

      const elapsed = Date.now() - lastActivity;
      const remaining = TIMEOUT_DURATION - elapsed;
      return Math.max(0, remaining);
    } catch (e) {
      console.error('Error getting time remaining:', e);
      return 0;
    }
  }, [TIMEOUT_DURATION, getCurrentRole]);

  const autoLogout = useCallback(() => {
    const role = getCurrentRole();
    if (role) {
      sessionStorage.removeItem(role);
    }
    setAuthState({
      isAdminLoggedIn: false,
      isFacultyLoggedIn: false,
      isStudentLoggedIn: false
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const currentPath = window.location.pathname;
    if (!['/', '/courses', '/facultys', '/about', '/forgotpassword', '/contactadmin'].includes(currentPath)) {
      window.location.href = '/';
    }
  }, [getCurrentRole]);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const role = getCurrentRole();
    if (role) {
      updateLastActivity(role);
    }
    const timeRemaining = getTimeRemaining();
    if (timeRemaining <= 0) {
      autoLogout();
    } else if (timeRemaining > 0) {
      timeoutRef.current = setTimeout(autoLogout, timeRemaining);
    }
  }, [autoLogout, getCurrentRole, getTimeRemaining, updateLastActivity]);

  const handleLogout = useCallback((role) => {
    sessionStorage.removeItem(role);
    setAuthState(checkAuthState());
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [checkAuthState]);

  useEffect(() => {
    setAuthState(checkAuthState());
  }, [checkAuthState]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => {
      if (getCurrentRole()) {
        resetTimeout();
      }
    };
    const options = { passive: true, capture: true };
    events.forEach(event => {
      document.addEventListener(event, handleActivity, options);
    });
    resetTimeout();
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, options);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout, getCurrentRole]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(checkAuthState());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuthState(prevState => {
        const newState = checkAuthState();
        if (
          newState.isAdminLoggedIn !== prevState.isAdminLoggedIn ||
          newState.isFacultyLoggedIn !== prevState.isFacultyLoggedIn ||
          newState.isStudentLoggedIn !== prevState.isStudentLoggedIn
        ) {
          return newState;
        }
        return prevState;
      });
    }, 30000);
    return () => clearInterval(intervalId);
  }, [checkAuthState]);

  return (
    <Router>
      <Routes>
        {authState.isStudentLoggedIn && (
          <Route path="/student/*" element={<StudentLayout onLogout={() => handleLogout('student')} />} />
        )}
        {authState.isFacultyLoggedIn && (
          <Route path="/faculty/*" element={<FacultyLayout onLogout={() => handleLogout('faculty')} />} />
        )}
        {authState.isAdminLoggedIn && (
          <Route path="/admin/*" element={<AdminLayout onLogout={() => handleLogout('admin')} />} />
        )}
        {!authState.isAdminLoggedIn && !authState.isFacultyLoggedIn && !authState.isStudentLoggedIn && (
          <>
            <Route path="/" element={<Landing setAuthState={setAuthState} />} />
            <Route path="/courses" element={<AllCourses setAuthState={setAuthState} />} />
            <Route path="/facultys" element={<Faculty setAuthState={setAuthState} />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/contactadmin" element={<ContactAdmin />} />
          </>
        )}
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
