import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AllCourses from './pages/Allcourses';
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
  // Helper function to check localStorage
  const checkAuthState = () => ({
    isAdminLoggedIn: localStorage.getItem('admin') !== null,
    isFacultyLoggedIn: localStorage.getItem('faculty') !== null,
    isStudentLoggedIn: localStorage.getItem('student') !== null
  });

  const [authState, setAuthState] = useState(checkAuthState);

  const handleLogout = (role) => {
    localStorage.removeItem(role);
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

  // console.log('Current auth state:', authState);
  // console.log('localStorage admin:', localStorage.getItem('admin'));
  // console.log('localStorage faculty:', localStorage.getItem('faculty'));
  // console.log('localStorage student:', localStorage.getItem('student'));

  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        {authState.isStudentLoggedIn ? (
          <Route path="/student" element={<StudentLayout onLogout={() => handleLogout('student')}/>}>
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

        {/* Faculty Routes */}
        {authState.isFacultyLoggedIn ? (
          <Route path="/faculty" element={<FacultyLayout onLogout={() => handleLogout('faculty')}/>}>
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

        {/* Admin Routes */}
        {authState.isAdminLoggedIn ? (
          <Route path="/admin" element={<AdminLayout onLogout={() => handleLogout('admin')}/>}>
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

        {/* Public Routes - Only show when no one is logged in */}
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

        {/* Fallback route - handles redirects after refresh */}
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