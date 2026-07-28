import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

import CourseCard from './CourseCard';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');

        console.log('courses', response.data);

        setCourses(response.data);
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          setRequiresLogin(true);
          return;
        }

        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>All Courses</h2>
      {requiresLogin ? (
        <p>
          Please <Link to="/login">log in</Link> to view courses.
        </p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
