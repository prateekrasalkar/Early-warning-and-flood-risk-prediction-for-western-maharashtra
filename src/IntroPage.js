import React, { useState, useEffect } from "react";
import "./IntroPage.css";
import { useNavigate } from "react-router-dom";

const aboutImages = [
  "images/img1.jpg",
  "images/img2.jpg",
  "images/img3.jpg",
  "images/img4.jpg",
  "images/img5.jpg",
  "images/img6.jpg",
];

const timelineEvents = [
  {
    year: "2005",
    text: "Sangli witnessed one of the worst floods in its history. The Krishna and Warna rivers overflowed due to incessant rains, causing widespread damage and displacing over 20,000 people.",
  },
  {
    year: "2006",
    text: "In 2006, the Krishna River at Irwin Bridge in Sangli reached a level of 541.95 meters. The danger level for the bridge is 540.77 meters.",
  },
  {
    year: "2019",
    text: "Another catastrophic flood hit Sangli. Torrential rains caused the Krishna river and its tributaries to breach their banks, affecting more than 200,000 residents.",
  },
  {
    year: "2021",
    text: "Heavy monsoon rainfall once again brought flooding to Sangli. Though less severe than 2019, it disrupted transport, agriculture, and local livelihoods.",
  },
  {
    year: "2022",
    text: "Intense rains caused riverbanks to overflow, leading to waterlogging and localized flooding across several areas of Sangli city and nearby villages.",
  },
];

const IntroPage = () => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % aboutImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="intro-page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src="images/walchandlogo.png"
            alt="Walchand Logo"
            className="nav-logo"
          />
          <img src="images/smkc.png" alt="SMKC Logo" className="nav-logo" />
          <span className="college-name">
            Walchand College of Engineering, Sangli
            <br />and <br />
            Municipal Corporation of Sangli Miraj and Kupwad City
          </span>
        </div>
        <div className="nav-right">
          <a href="#overview">Overview</a>
          <a href="#timeline">Timeline</a>
          <a href="#effects">Effects</a>
          <a href="#contact">Contact</a>
          <button className="nav-btn" onClick={() => navigate("/predict")}>
            🚀 Model
          </button>
        </div>
      </nav>

      {/* ================= ABOUT / OVERVIEW ================= */}
      <section id="overview" className="about-section about-me-section">
        <div className="about-me-container">
          <div className="about-me-photo">
            <img
              src={aboutImages[currentImg]}
              alt="About Project"
              className="about-carousel-img"
              key={currentImg}
            />
          </div>
          <div className="about-me-text">
            <h2>Flood Prediction Project</h2>
            <p>
              This project aims to develop a robust and intelligent system for
              predicting floods in Sangli using modern computational techniques.
              Traditional hydrological and statistical models often fail to
              capture complex and nonlinear interactions between rainfall, river
              inflow, urbanization, and drainage patterns. To overcome these
              limitations, our project explores Machine Learning (ML) and Deep
              Learning (DL) models such as Random Forest, LSTM, CNN, and
              Transformer-based networks. By integrating multiple data sources —
              including rainfall records, water-level gauges, satellite imagery,
              and real-time IoT sensors — the system can provide accurate and
              timely flood forecasts. The ultimate goal is to assist disaster
              management authorities with proactive alerts, ensuring safety and
              reducing socio-economic losses.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FLOOD OCCURRENCES TIMELINE ================= */}
      <section id="timeline" className="flood-timeline-section">
        <h2>Timeline of Major Floods in Sangli</h2>
        <div className="timeline-flow">
          <div className="timeline-main-line" aria-hidden="true" />
          {timelineEvents.map((event, index) => (
            <article
              key={event.year}
              className="timeline-step"
            >
              <div className="timeline-year">{event.year}</div>
              <div className="timeline-step-card">
                <p>{event.text}</p>
              </div>
              <div className="timeline-connector" aria-hidden="true" />
              {index < timelineEvents.length - 1 ? (
                <div className="timeline-arrow" aria-hidden="true" />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* ================= FLOOD EFFECTS ================= */}
      <section id="effects" className="project-showcase-section">
        <div className="project-showcase-container">
          <div className="project-text">
            <h2>Effects of Flood</h2>
            <p>
              Sangli has faced four major floods in the last 20 years, including
              the devastating events of 2005 and 2019. These floods disrupted
              transportation, damaged homes and farmlands, displaced thousands of
              families, and caused huge economic losses. Beyond physical damage,
              floods also bring long-term impacts such as loss of livelihoods,
              health risks from waterborne diseases, and strain on civic
              infrastructure. The increasing frequency of such events, driven by
              climate change and urban expansion, highlights the urgent need for
              predictive systems that provide early warnings and enable
              authorities to respond effectively.
            </p>
          </div>

          {/* ✅ Images moved to bottom */}
          <div className="project-images">
            <img src="images/img7.jpg" alt="Flood Data Visualization" />
            <img src="images/img8.jpg" alt="Flood Prediction Model" />
            <img src="images/img9.jpg" alt="Flood Alert System" />
          </div>
        </div>
      </section>


      {/* ================= CONTACT ================= */}
      <section id="contact" className="contact-section">
        <h2>Contact</h2>
        <p>
          For more information about this project, please reach out to us at:
          <br />
          <b>Email:</b> prasalkar916@gmail.com
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <p>
          © 2025 Flood Prediction Project | Made with ❤️ by Prateek Rasalkar
          <br />
        </p>
      </footer>
    </div>
  );
};

export default IntroPage;
