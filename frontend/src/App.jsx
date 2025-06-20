import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AllCourses from './pages/AllCourses';
import Faculty from './pages/Faculty';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ContactAdmin from './pages/ContactAdmin';

import StudentLayout from './modules/Student/StudentLayout';
import StudentHome from './modules/Student/StudentHome';
import StudentGrade from './modules/Student/StudentGrade';
import StudentCourseRegistration from './modules/Student/StudentCourseRegisteration';
import StudentAttendance from './modules/Student/StudentAttendance';
import StudentCircular from './modules/Student/StudentCircular';
import StudentFacultyCircular from './modules/Student/StudentFacultyCircular';
import StudentClass from './modules/Student/StudentClass';
import StudentAcademic from './modules/Student/StudentAcademic';
import StudentEditProfile from './modules/Student/StudentEditProfle';
import StudentMaterials from './modules/Student/StudentMaterials';

import FacultyLayout from './modules/Faculty/FacultyLayout';
import FacultyHome from './modules/Faculty/FacultyHome';
import FacultyMyCourseDetails from './modules/Faculty/FacultyMyCourseDetails';
import FacultyGiveGrades from './modules/Faculty/FacultyGiveGrades';
import FacultyUploadMaterials from './modules/Faculty/FacultyUploadMaterials';
import FacultyTakeAttendance from './modules/Faculty/FacultyTakeAttendance';
import FacultyCircular from './modules/Faculty/FacultyCircular';
import FacultyClass from './modules/Faculty/FacultyClass';
import FacultyAcademic from './modules/Faculty/FacultyAcademic';
import FacultyEditProfile from './modules/Faculty/FacultyEditProfile';

import AdminLayout from './modules/Admin/AdminLayout';
import AdminHome from './modules/Admin/AdminHome';
import AdminStudentList from './modules/Admin/AdminStudentList';
import AdminFacultyList from './modules/Admin/AdminFacultyList';
import AdminFacultyCircular from './modules/Admin/AdminFacultyCircular';
import AdminCourseList from './modules/Admin/AdminCourseList';
import AdminCourseMapping from './modules/Admin/AdminCourseMapping';
import AdminEditProfile from './modules/Admin/AdminEditProfile';

import AdminAddStudent from './modules/Admin/AdminAddStudent';
import AdminAddStudentUpload from './modules/Admin/AdminAddStudentUpload';
import AdminEditStudent from './modules/Admin/AdminEditStudent';
import AdminAddCourse from './modules/Admin/AdminAddCourse';
import AdminEditCourse from './modules/Admin/AdminEditCourse';
import AdminCircular from './modules/Admin/AdminCircular';

const App = () => {
  const TIMEOUT_DURATION = 30 * 60 * 1000;
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
        const data = localStorage.getItem(role);
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
            localStorage.removeItem(role);
          }
        }
      });

      if (expiredRole) {
        localStorage.removeItem(expiredRole);
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
      const userData = localStorage.getItem(role);
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.lastActivity = Date.now();
        localStorage.setItem(role, JSON.stringify(parsedData));
      }
    } catch (e) {
      console.error('Error updating last activity:', e);
    }
  }, []);

  const getCurrentRole = useCallback(() => {
    if (localStorage.getItem('admin')) return 'admin';
    if (localStorage.getItem('faculty')) return 'faculty';
    if (localStorage.getItem('student')) return 'student';
    return null;
  }, []);

  const getTimeRemaining = useCallback(() => {
    try {
      const role = getCurrentRole();
      if (!role) return 0;

      const userData = localStorage.getItem(role);
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
      localStorage.removeItem(role);
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
    if (!sessionStorage.getItem('alreadyReloaded')) {
      sessionStorage.setItem('alreadyReloaded', 'true');
      window.location.reload();
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
    if (timeRemaining <= 0 && !sessionStorage.getItem('alreadyReloaded')) {
      autoLogout();
    } else if (timeRemaining > 0) {
      timeoutRef.current = setTimeout(autoLogout, timeRemaining);
    }
  }, [autoLogout, getCurrentRole, getTimeRemaining, updateLastActivity]);

  const handleLogout = useCallback((role) => {
    localStorage.removeItem(role);
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
        {/* Student Routes */}
        {authState.isStudentLoggedIn && (
          <Route path="/student" element={<StudentLayout onLogout={() => handleLogout('student')} />}>
            <Route index element={<Navigate to="/student/home/dashboard" replace />} />
            <Route path="home/dashboard" element={<StudentHome />} />
            <Route path="home/circular" element={<StudentCircular />} />
            <Route path="mycourse/grades" element={<StudentGrade />} />
            <Route path="mycourse/course-registration" element={<StudentCourseRegistration />} />
            <Route path="mycourse/attendance" element={<StudentAttendance />} />
            <Route path="mycourse/materials" element={<StudentMaterials />} />
            <Route path="mycourse/facultycirculars" element={<StudentFacultyCircular />} />
            <Route path="timetable/class" element={<StudentClass />} />
            <Route path="timetable/academic" element={<StudentAcademic />} />
            <Route path="editprofile" element={<StudentEditProfile />} />
          </Route>
        )}

        {/* Faculty Routes */}
        {authState.isFacultyLoggedIn && (
          <Route path="/faculty" element={<FacultyLayout onLogout={() => handleLogout('faculty')} />}>
            <Route index element={<Navigate to="/faculty/home/dashboard" replace />} />
            <Route path="home/dashboard" element={<FacultyHome />} />
            <Route path="mydept/course-details" element={<FacultyMyCourseDetails />} />
            <Route path="mydept/give-grades" element={<FacultyGiveGrades />} />
            <Route path="mydept/upload-materials" element={<FacultyUploadMaterials />} />
            <Route path="mydept/take-attendance" element={<FacultyTakeAttendance />} />
            <Route path="mydept/circular" element={<FacultyCircular />} />
            <Route path="timetable/class" element={<FacultyClass />} />
            <Route path="timetable/academic" element={<FacultyAcademic />} />
            <Route path="editprofile" element={<FacultyEditProfile />} />
          </Route>
        )}

        {/* Admin Routes */}
        {authState.isAdminLoggedIn && (
          <Route path="/admin" element={<AdminLayout onLogout={() => handleLogout('admin')} />}>
            <Route index element={<Navigate to="/admin/home/dashboard" replace />} />
            <Route path="home/dashboard" element={<AdminHome />} />
            <Route path="home/circular" element={<AdminCircular />} />
            <Route path="student/list" element={<AdminStudentList />} />
            <Route path="student/add" element={<AdminAddStudent />} />
            <Route path="student/upload" element={<AdminAddStudentUpload />} />
            <Route path="student/edit/:id" element={<AdminEditStudent />} />
            <Route path="faculty/list" element={<AdminFacultyList />} />
            <Route path="faculty/circular" element={<AdminFacultyCircular />} />
            <Route path="course/list" element={<AdminCourseList />} />
            <Route path="course/add" element={<AdminAddCourse />} />
            <Route path="course/edit/:courseCode" element={<AdminEditCourse />} />
            <Route path="course/mapping" element={<AdminCourseMapping />} />
            <Route path="editprofile" element={<AdminEditProfile />} />
          </Route>
        )}

        {/* Public Routes */}
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

        {/* Fallback Route */}
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
