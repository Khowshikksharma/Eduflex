import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./landingstyle.css";
import EduflexLogo from '../assets/edufelxlogo.jpg';
import usePopup from '../components/usePopup';
import About from './About';
import LoginPopup from './LoginPopup';

const Landing = () => {
  const [click, setClick] = useState(false);
  const { showPopup, PopupWrapper } = usePopup(); // Initialize the popup hook

  const courses = [
    { icon: "fa-laptop-code", title: "Web Development", count: "25 Courses" },
    { icon: "fa-mobile-alt", title: "App Development", count: "15 Courses" },
    { icon: "fa-chart-line", title: "Data Science", count: "20 Courses" },
    { icon: "fa-paint-brush", title: "Graphic Design", count: "12 Courses" },
  ];

  const testimonials = [
    { text: "This platform transformed my career.", name: "Sarah Johnson", role: "Web Developer" },
    { text: "The best investment in my education.", name: "Michael Chen", role: "Data Scientist" },
    { text: "Flexible learning with top instructors.", name: "Emma Rodriguez", role: "UX Designer" },
  ];

  const stats = [
    { number: "10,000+", label: "Students Enrolled" },
    { number: "200+", label: "Expert Instructors" },
    { number: "500+", label: "Courses Available" },
    { number: "95%", label: "Satisfaction Rate" },
  ];
  
  const handleAboutClick = (e) => {
    e.preventDefault();
    showPopup(<About />);
    setClick(false);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    showPopup(<LoginPopup />);
    setClick(false);
  };


  const Head = () => (
    <section className='head'>
      <div className='container'>
        <div className='logo'>
          <img src={EduflexLogo} alt='Eduflex Logo' />
          <span>YOUR PATHWAY TO KNOWLEDGE</span>
        </div>
      </div>
    </section>
  );

  const Header = () => (
    <>
      <Head />
      <header>
        <div className='container'>
          <nav className='nav-container'>
            <ul className={click ? "mobile-nav active" : "nav-menu"}>
              <li><Link to='/' onClick={() => setClick(false)}>Home</Link></li>
              <li><Link to='/courses' onClick={() => setClick(false)}>Courses</Link></li>
              <li><Link to='/facultys' onClick={() => setClick(false)}>Faculty</Link></li>
              <li><a href="#about" onClick={handleAboutClick}>About</a></li>
            </ul>
            <div style={{ padding: '8px 20px' }}>
              <a href="#login" onClick={handleLoginClick} style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '500',
                padding: '8px 20px'
              }}>Login</a>
            </div>
            <button onClick={() => setClick(!click)} style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#1e293b',
              cursor: 'pointer'
            }}>
              {click ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
        </div>
      </header>
    </>
  );

  const Heading = ({ subtitle, title }) => (
    <div className='heading'>
      <h3>{subtitle}</h3>
      <h1>{title}</h1>
    </div>
  );

  const Hero = () => (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Unlock Your Potential With Online Learning</h1>
          <p>Join over 10,000 students advancing their careers.</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Explore Course List</Link>
            <Link to="/facultys" className="btn btn-secondary">Inspect Instructors List</Link>
          </div>
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section className="features">
      <div className="container">
        <Heading subtitle="WHY CHOOSE US" title="Benefits of Learning With Us" />
        <div className="features-grid">
          {courses.map((course, index) => (
            <div className="feature-card" key={index}>
              <i className={`fas ${course.icon}`}></i>
              <h3>{course.title}</h3>
              <p>{course.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Stats = () => (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <h2>{stat.number}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section className="testimonials">
      <div className="container">
        <Heading subtitle="TESTIMONIALS" title="What Our Students Say" />
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
              <p>{testimonial.text}</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer>
      <div className='container'>
        <div className='footer-grid'>
          <div className='footer-col logo-col'>
            <h1>EDUFLEX</h1>
            <span>YOUR PATHWAY TO KNOWLEDGE</span>
            <p>Empowering learners worldwide with accessible education.</p>
          </div>
          <div className='footer-col'>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to='/' onClick={() => setClick(false)}>Home</Link></li>
              <li><Link to='/courses' onClick={() => setClick(false)}>Courses</Link></li>
              <li><Link to='/facultys' onClick={() => setClick(false)}>Faculty</Link></li>
              <li><a href="#about" onClick={handleAboutClick}>About</a></li>
            </ul>
          </div>
          <div className='footer-col contact-col'>
            <h3>Contact Us</h3>
            <ul>
              <li><i className='fa fa-phone-alt'></i> +91 6309876645</li>
              <li><i className='fa fa-envelope'></i> info@eduflex.com</li>
              <li><i className='fa fa-map-marker-alt'></i> Hyderabad, India</li>
            </ul>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>&copy; {new Date().getFullYear()} Eduflex | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="landing-container">
      <Header />
      <main className="main-content">
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
      <PopupWrapper /> {/* This will render the popup when shown */}
    </div>
  );
};

export default Landing;