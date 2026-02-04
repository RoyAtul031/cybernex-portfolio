import React, { useState, useEffect, useRef } from 'react';
import TerminalBoot from './components/TerminalBoot';
import MatrixIntro from './components/MatrixIntro';
import CinematicVideo from './components/CinematicVideo';

enum BootState {
  VIDEO,
  TERMINAL,
  APP
}

const TextReveal: React.FC<{ text: string; className?: string; delayOffset?: number }> = ({ text, className, delayOffset = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // We disconnect to play animation only once
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');
  // Calculate delay to make it "smoothly appearing one by one"
  // Letters speed 25ms

  return (
    <p ref={ref} className={`${className} ${isVisible ? 'active' : ''} reveal-text`}>
      {words.map((word, wIndex) => {
        // calculate cumulative index for delay based on word count so far
        const previousChars = words.slice(0, wIndex).join(' ').length + (wIndex > 0 ? 1 : 0);

        return (
          <span key={wIndex} className="inline-block whitespace-nowrap mr-1">
            {word.split('').map((char, cIndex) => (
              <span
                key={cIndex}
                className="letter"
                style={{ transitionDelay: `${delayOffset + (previousChars + cIndex) * 20}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </p>
  );
};

const App: React.FC = () => {
  const [bootState, setBootState] = useState<BootState>(BootState.VIDEO);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Typing Effect Logic
  const [typedText, setTypedText] = useState('');
  useEffect(() => {
    if (bootState !== BootState.APP) return;

    const words = ["Frontend Developer", "UI/UX Designer", "Web Enthusiast", "React Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timer: any;

    const type = () => {
      const currentWord = words[wordIndex];
      const displayedText = currentWord.substring(0, charIndex);
      setTypedText(displayedText);

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        timer = setTimeout(type, typingSpeed);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        timer = setTimeout(type, typingSpeed / 2);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % words.length;
        }
        timer = setTimeout(type, 1000);
      }
    };

    timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, [bootState]);

  // Scroll Logic (Active Nav + Reveal + BackToTop)
  useEffect(() => {
    if (bootState !== BootState.APP) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;

      // Reveal Elements
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('active-reveal');
        }
      });

      // Active Section
      const sections = ['home', 'about', 'certificates', 'project', 'services', 'contact'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            setActiveSection(id);
          }
        }
      });

      // Back to top
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initial reveal
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [bootState]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const openCV = () => {
    const link = document.createElement('a');
    link.href = '/assets/documents/cv.pdf';
    link.download = 'Atul_Roy_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (bootState === BootState.VIDEO) return <CinematicVideo onComplete={() => setBootState(BootState.TERMINAL)} />;
  if (bootState === BootState.TERMINAL) return <TerminalBoot onComplete={() => setBootState(BootState.APP)} />;

  return (
    <div>
      {/* Header */}
      <header className="header-list">
        <div className="div-list">
          <ul className="ul-list">
            {[
              { id: 'home', icon: 'fa-house', label: 'Home' },
              { id: 'about', icon: 'fa-address-card', label: 'About' },
              { id: 'certificates', icon: 'fa-certificate', label: 'Certificates' },
              { id: 'project', icon: 'fa-folder-open', label: 'Projects' },
              { id: 'services', icon: 'fa-code', label: 'Services' },
              { id: 'contact', icon: 'fa-envelope', label: 'Contact' },
            ].map((item) => (
              <li key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => scrollToSection(item.id)}>
                <i className={`fa-regular ${item.icon} ${item.id === 'services' || item.id === 'certificates' ? 'fa-solid' : ''}`}></i>
                <a href={`#${item.id}`} onClick={(e) => e.preventDefault()}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Home Section */}
      <section className="home reveal" id="home">
        <p className="home-p">
          <span className="home-s">. </span>Available for freelance work
        </p>
        <div className="home-container">
          <div className="home-section">
            <div className="info-home">
              <h1>Hi, I'm Atul</h1>
              <h3>
                {typedText}<span className="cursor">|</span>
              </h3>
              <div className="info-p">
                <TextReveal
                  text="I create beautiful, functional, and user-centered digital experiences. With"
                  delayOffset={0}
                  className="mb-1"
                />
                <TextReveal
                  text="2+ years of experiences in web Development, Python & Data Analysis, I bring ideas to life through"
                  delayOffset={1000} // slight delay for second line
                  className="mb-1"
                />
                <TextReveal
                  text="clean code and thoughtful design"
                  delayOffset={2500} // delay for third line
                />
              </div>
              <div className="info-p2">
                <p><i className="fa-solid fa-location-dot"></i> Based in Kolkata</p>
                <p><i className="fa-solid fa-briefcase"></i> Available Now</p>
              </div>
              <div className="btnn">
                <button className="btn-home1"><i className="fa-solid fa-arrow-right"></i> Hire Me</button>
                <button className="btn-home2" onClick={openCV}><i className="fa-solid fa-download"></i> Download CV</button>
              </div>
              <div className="hhr">
                <hr />
              </div>
              <div className="follow">
                <p className="followw">Follow me:</p>
                <ul>
                  <li><a href="#"><i className="fa-brands fa-github"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-discord"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <img src="/assets/images/profile.jpeg" alt="Atul" />
        </div>
      </section>

      {/* About Section */}
      <section className="about reveal" id="about">
        <p id="about-label">ABOUT ME</p>
        <div className="title">
          <h1>Building Meaningful</h1>
          <h1>Digital Experiences</h1>
        </div>
        <div className="hrrr">
          <hr />
        </div>
        <div className="about-container">
          <div className="info-about">
            <div className="about-info">
              <p>
                I'm a skilled developer with expertise in Python, ethical hacking, and cybersecurity, creating modern,
                user-friendly web applications that are both functional and secure.
                <br />My journey began with a love for design and evolved into a deep curiosity for how the web works —
                combining <br /> logic with creativity to bring ideas to life.
              </p>
              <p>
                When I'm not coding, I enjoy learning new technologies, improving my projects, <br /> and exploring better
                ways to make the web faster and more engaging.
                <br />I believe in continuous learning, attention to detail, and the power of clean, meaningful design
              </p>
            </div>
            <h2>What Drives Me</h2>
            <div className="card">
              <div className="c1">
                <i className="fa-solid fa-code"></i>
                <h3>Languages</h3>
                <p>HTML, CSS, JavaScript, Java, C, React, Node.js, Tailwind CSS, Python, C++</p>
              </div>
              <div className="c1">
                <i className="fa-solid fa-graduation-cap"></i>
                <h3>Education</h3>
                <p>Bsc.in Computer Science</p>
              </div>
              <div className="c1">
                <i className="fa-solid fa-folder-open"></i>
                <h3>Projects</h3>
                <p>Built more than 5 projects</p>
              </div>
            </div>
          </div>
          <img src="/assets/images/about.jpeg" alt="About" />
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificates reveal" id="certificates">
        <p className="section-label">CERTIFICATES</p>
        <h1>My Certifications</h1>
        <hr />
        <div className="info-cert">
          <p>A showcase of my professional certifications demonstrating my commitment to continuous learning and expertise
            in various technologies.</p>
        </div>
        <div className="certificates-container">
          {[
            { id: 1, title: 'TCS iON Career Edge - Young Professional', issuer: 'TCS', date: '2025', pdf: '/assets/documents/certificate1.pdf' },
            { id: 2, title: 'GenAI Powered Data Analytics Job Simulation', issuer: 'TCS', date: '2025', pdf: '/assets/documents/certificate2.pdf' },
            { id: 3, title: 'Cyber Job Simulation', issuer: 'DELOITTE', date: '2025', pdf: '/assets/documents/certificate3.pdf' },
          ].map((cert) => (
            <div className="certificate-card" key={cert.id}>
              <i className="fa-solid fa-certificate fa-3x"></i>
              <h3>{cert.title}</h3>
              <p>Issued by: {cert.issuer}</p>
              <p>Date: {cert.date}</p>
              <a href={cert.pdf} className="btn-cert" target="_blank" rel="noopener noreferrer">Download PDF</a>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="project reveal" id="project">
        <p className="section-label">PROJECTS</p>
        <h1>Featured Work</h1>
        <hr />
        <div className="info-pro">
          <p>A showcase of my recent projects demonstrating expertise in full-stack </p>
          <p>development, modern frameworks, and creative problem-solving.</p>
        </div>
        <div className="projects-container">

          <div className="project-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/assets/images/project1.png" alt="MoodMap" />
                <h3>MoodMap</h3>
                <p>Built a location-based recommendation app using Maps & Places APIs with dynamic filtering and real-time user preferences.</p>
              </div>
              <div className="flip-card-back">
                <div className="skills">
                  <a href="#">HTML</a>
                  <a href="#">CSS</a>
                  <a href="#">JavaScript</a>
                </div>
                <div className="btns">
                  <a href="https://github.com/RoyAtul031/Mood_Map" className="btn" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                  <a href="https://mood-map-eta.vercel.app/" className="btn" target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                </div>
              </div>
            </div>
          </div>

          <div className="project-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/assets/images/project2.png" alt="EchoNote" />
                <h3>EchoNote</h3>
                <p>Developed a voice-driven Al tool that transcribes and summarizes spoken notes using speech recognition and LLMs.</p>
              </div>
              <div className="flip-card-back">
                <div className="skills">
                  <a href="#">HTML</a>
                  <a href="#">CSS</a>
                  <a href="#">Bootstrap</a>
                </div>
                <div className="btns">
                  <a href="https://github.com/RoyAtul031/echonote" className="btn" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                  <a href="https://echonote.vercel.app/" className="btn" target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                </div>
              </div>
            </div>
          </div>

          <div className="project-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/assets/images/project3.png" alt="FreshCheck" />
                <h3>FreshCheck</h3>
                <p>Built an image classification system using pre-trained vision models to assess food quality from user-uploaded images.</p>
              </div>
              <div className="flip-card-back">
                <div className="skills">
                  <a href="#">HTML</a>
                  <a href="#">CSS</a>
                  <a href="#">API</a>
                </div>
                <div className="btns">
                  <a href="https://github.com/RoyAtul031/FreshCheck-" className="btn" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                  <a href="https://fresh-check-chi.vercel.app/" className="btn" target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                </div>
              </div>
            </div>
          </div>

          {/* Add more projects similarly if needed */}

        </div>
      </section>

      {/* Services Section */}
      <section className="services reveal" id="services">
        <p className="section-label">SERVICES</p>
        <h1>Our Features & Services</h1>
        <hr />
        <div className="services-container">

          <div className="service-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="https://img.icons8.com/ios/100/474af0/web.png" alt="Web Development" />
                <h3>Web App Development</h3>
                <p>Turning ideas into fast, functional web applications.</p>
              </div>
              <div className="flip-card-back">
                <p>Custom websites, responsive design, and modern web web apps with intuitive UI/UX and robust functionality.</p>
              </div>
            </div>
          </div>

          <div className="service-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="https://img.icons8.com/ios/100/474af0/smartphone.png" alt="App Development" />
                <h3>Frontend Developent</h3>
                <p>Passionate about UI, UX, and performance.</p>
              </div>
              <div className="flip-card-back">
                <p>Creative and cool frontends with intuitive UI/UX and robust functionality.</p>
              </div>
            </div>
          </div>

          <div className="service-card flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="https://img.icons8.com/ios/100/474af0/commercial.png" alt="Digital Marketing" />
                <h3>Data Analysis</h3>
                <p>Transforming complex datasets into clear insights.</p>
              </div>
              <div className="flip-card-back">
                <p>Advanced data analysis for performance and growth.Delivering accurate, insight-driven analytical solutions.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="contact reveal" id="contact">
        <p className="section-label">CONTACT</p>
        <h1>Get in Touch with Us</h1>
        <hr />
        <div className="contact-content">
          <div className="contact-info">
            <p className="intro">I'm always open to discuss exciting projects and new opportunities. Let's collaborate!</p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>atul26396@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>7872764185</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>

            <div className="social-links">
              <a href="https://github.com/RoyAtul031" className="social-link" target="_blank">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="www.linkedin.com/in/atul-roy-28a320254" className="social-link" target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/atul_roy321/" className="social-link" target="_blank">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="contact-form">
            <form id="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required name="user_name" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required name="user_email" />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn-send">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <h2 className="footer-logo">Atul Roy</h2>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#certificates">Certificates</a></li>
            <li><a href="#project">Projects</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="footer-social">
            <a href="#" target="_blank"><i className="fa-brands fa-github"></i></a>
            <a href="#" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" target="_blank"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
          <p className="footer-copy">&copy; Atul Roy. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <div id="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex' }}>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
      )}
    </div>
  );
};

export default App;