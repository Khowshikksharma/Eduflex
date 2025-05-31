import React from 'react';
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
import AdminStudentCircular from './modules/Admin/AdminStudentCircular';
import AdminFacultyList from './modules/Admin/AdminFacultyList';
import AdminFacultyCircular from './modules/Admin/AdminFacultyCircular';
import AdminCourseList from './modules/Admin/AdminCourseList';
import AdminCourseMapping from './modules/Admin/AdminCourseMapping';
import AdminEditProfile from './modules/Admin/AdminEditProfile';

import AdminAddStudent from './modules/Admin/AdminAddStudent';
import AdminEditStudent from './modules/Admin/AdminEditStudent';
import AdminAddCourse from './modules/Admin/AdminAddCourse';
import AdminEditCourse from './modules/Admin/AdminEditCourse';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/home/dashboard" replace />} />
          <Route path="home">
            <Route path="dashboard" element={<StudentHome />} />
          </Route>
          <Route path="mycourse">
            <Route path="grades" element={<StudentGrade />} />
            <Route path="course-registration" element={<StudentCourseRegistration />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="circular" element={<StudentCircular />} />
            <Route path="materials" element={<StudentMaterials />} />
          </Route>
          <Route path="timetable">
            <Route path="class" element={<StudentClass />} />
            <Route path="academic" element={<StudentAcademic />} />
          </Route>
          <Route path="editprofile" element={<StudentEditProfile />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<Navigate to="/faculty/home/dashboard" replace />} />
          <Route path="home">
            <Route path="dashboard" element={<FacultyHome />} />
          </Route>
          <Route path="mydept">
            <Route path="course-details" element={<FacultyMyCourseDetails />} />
            <Route path="give-grades" element={<FacultyGiveGrades />} />
            <Route path="upload-materials" element={<FacultyUploadMaterials />} />
            <Route path="take-attendance" element={<FacultyTakeAttendance />} />
            <Route path="circular" element={<FacultyCircular />} />
          </Route>
          <Route path="timetable">
            <Route path="class" element={<FacultyClass />} />
            <Route path="academic" element={<FacultyAcademic />} />
          </Route>
          <Route path="editprofile" element={<FacultyEditProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/home/dashboard" replace />} />
          <Route path="home">
            <Route path="dashboard" element={<AdminHome />} />
          </Route>
          <Route path="student">
            <Route path="list" element={<AdminStudentList />} />
            <Route path="add" element={<AdminAddStudent />} />
            <Route path="edit/:id" element={<AdminEditStudent />} />
            <Route path="circular" element={<AdminStudentCircular />} />
          </Route>
          <Route path="faculty">
            <Route path="list" element={<AdminFacultyList />} />
            <Route path="circular" element={<AdminFacultyCircular />} />
          </Route>
          <Route path="course">
            <Route path="list" element={<AdminCourseList />} />
            <Route path="add" element={<AdminAddCourse />} />
            <Route path="edit/:courseCode" element={<AdminEditCourse />} />
            <Route path="mapping" element={<AdminCourseMapping />} />
          </Route>
          <Route path="editprofile" element={<AdminEditProfile />} />
        </Route>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/facultys" element={<Faculty />} />
        <Route path="/about" element={<About />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;