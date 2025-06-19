import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AllCourses from './pages/Allcourses';
import Faculty from './pages/Faculty';
import About from './pages/About';

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
import ForgotPassword from './pages/ForgotPassword';
import ContactAdmin from './pages/ContactAdmin';

const App = () => {
  const TIMEOUT_DURATION = 30 * 60 * 1000;
  const timeoutRef = useRef(null);

  const printTime = () => {
    const now = new Date();
    console.log(`Current Time: ${now.toLocaleString()}`);
  };

  const checkAuthState = () => {
    const admin = localStorage.getItem('admin');
    const faculty = localStorage.getItem('faculty');
    const student = localStorage.getItem('student');

    const now = Date.now();
    let expiredRole = null;

    if (admin) {
      const adminData = JSON.parse(admin);
      if (adminData.loginTime && (now - adminData.loginTime) > TIMEOUT_DURATION) {
        expiredRole = 'admin';
      }
    }

    if (faculty) {
      const facultyData = JSON.parse(faculty);
      if (facultyData.loginTime && (now - facultyData.loginTime) > TIMEOUT_DURATION) {
        expiredRole = 'faculty';
      }
    }

    if (student) {
      const studentData = JSON.parse(student);
      if (studentData.loginTime && (now - studentData.loginTime) > TIMEOUT_DURATION) {
        expiredRole = 'student';
      }
    }

    if (expiredRole) {
      localStorage.removeItem(expiredRole);
      setTimeout(() => {
        alert('Session expired. You have been logged out due to inactivity.');
      }, 100);
    }

    return {
      isAdminLoggedIn: localStorage.getItem('admin') !== null,
      isFacultyLoggedIn: localStorage.getItem('faculty') !== null,
      isStudentLoggedIn: localStorage.getItem('student') !== null
    };
  };

  const updateLastActivity = (role) => {
    const userData = localStorage.getItem(role);
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        parsedData.lastActivity = Date.now();
        localStorage.setItem(role, JSON.stringify(parsedData));
      } catch (e) {
        console.error('Error updating last activity:', e);
      }
    }
  };

  const getCurrentRole = () => {
    if (localStorage.getItem('admin')) return 'admin';
    if (localStorage.getItem('faculty')) return 'faculty';
    if (localStorage.getItem('student')) return 'student';
    return null;
  };

  const getTimeRemaining = () => {
    const role = getCurrentRole();
    if (!role) return 0;

    const userData = localStorage.getItem(role);
    if (!userData) return 0;

    try {
      const parsedData = JSON.parse(userData);
      const lastActivity = parsedData.lastActivity || parsedData.loginTime;
      if (!lastActivity) return 0;

      const elapsed = Date.now() - lastActivity;
      const remaining = TIMEOUT_DURATION - elapsed;
      return Math.max(0, remaining);
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const [authState, setAuthState] = useState(checkAuthState);

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

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    alert('Session expired. You have been logged out due to inactivity.');
  }, []);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const role = getCurrentRole();
    if (role) {
      updateLastActivity(role);
    }

    const currentAuthState = checkAuthState();
    const isLoggedIn = currentAuthState.isAdminLoggedIn ||
      currentAuthState.isFacultyLoggedIn ||
      currentAuthState.isStudentLoggedIn;

    if (isLoggedIn) {
      const timeRemaining = getTimeRemaining();

      if (timeRemaining <= 0) {
        autoLogout();
        return;
      }

      timeoutRef.current = setTimeout(autoLogout, timeRemaining);
    }
  }, [autoLogout]);

  const handleLogout = (role) => {
    localStorage.removeItem(role);
    setAuthState({
      isAdminLoggedIn: false,
      isFacultyLoggedIn: false,
      isStudentLoggedIn: false
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setAuthState(checkAuthState());
    }, 100);
  };

  useEffect(() => {
    let isWindowClosing = false;

    const handleBeforeUnload = (e) => {
      if (e.returnValue === undefined && !isWindowClosing) {
        isWindowClosing = true;
        printTime();
        localStorage.removeItem('admin');
        localStorage.removeItem('faculty');
        localStorage.removeItem('student');
      }
    };

    const handleUnload = () => {
      if (isWindowClosing) {
        printTime();
        localStorage.removeItem('admin');
        localStorage.removeItem('faculty');
        localStorage.removeItem('student');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem('windowHidden', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        sessionStorage.removeItem('windowHidden');
      }
    };

    const checkIfWindowWasClosed = () => {
      const hiddenTime = sessionStorage.getItem('windowHidden');
      if (hiddenTime) {
        const timeDiff = Date.now() - parseInt(hiddenTime);
        if (timeDiff > 5000) {
          printTime();
          localStorage.removeItem('admin');
          localStorage.removeItem('faculty');
          localStorage.removeItem('student');
        }
        sessionStorage.removeItem('windowHidden');
      }
    };

    checkIfWindowWasClosed();

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    printTime();

    const timeInterval = setInterval(() => {
      printTime();
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const resetTimeoutOnActivity = () => {
      const currentAuthState = checkAuthState();
      const isLoggedIn = currentAuthState.isAdminLoggedIn ||
        currentAuthState.isFacultyLoggedIn ||
        currentAuthState.isStudentLoggedIn;

      if (isLoggedIn) {
        resetTimeout();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimeoutOnActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutOnActivity, true);
      });
    };
  }, [resetTimeout]);

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
    resetTimeout();

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, [authState, resetTimeout]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentAuthState = checkAuthState();
      const isLoggedIn = currentAuthState.isAdminLoggedIn ||
        currentAuthState.isFacultyLoggedIn ||
        currentAuthState.isStudentLoggedIn;

      if (!isLoggedIn && (authState.isAdminLoggedIn || authState.isFacultyLoggedIn || authState.isStudentLoggedIn)) {
        setAuthState(currentAuthState);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [authState]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {authState.isStudentLoggedIn ? (
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
        ) : null}

        {authState.isFacultyLoggedIn ? (
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
        ) : null}

        {authState.isAdminLoggedIn ? (
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
        ) : null}

        {!authState.isAdminLoggedIn && !authState.isFacultyLoggedIn && !authState.isStudentLoggedIn ? (
          <>
            <Route path="/" element={<Landing setAuthState={setAuthState} />} />
            <Route path="/courses" element={<AllCourses setAuthState={setAuthState} />} />
            <Route path="/facultys" element={<Faculty setAuthState={setAuthState} />} />
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
