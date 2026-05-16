import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./DetailsPage.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.port === "3000" ? "http://127.0.0.1:5000" : "");

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailsPage = () => {
  const navigate = useNavigate();
  const [damDetails, setDamDetails] = useState({});
  const [riverDetails, setRiverDetails] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);


    fetch(`${API_BASE}/get-all-details`)
      .then((response) => {
        if (!response.ok) {

          return response.json().then(errData => {
            throw new Error(errData.error || "Failed to fetch data from the backend.");
          });
        }
        return response.json();
      })
      .then((data) => {

        setDamDetails({
          discharge_rate: parseFloat(data.discharge_rate) || data.discharge_rate || "N/A",
          dam_level: parseFloat(data.dam_level) || data.dam_level || "N/A",
          dam_content: parseFloat(data.dam_content) || data.dam_content || "N/A",
        });

        setRiverDetails({
          riv_level_min: parseFloat(data.riv_level_min) || data.riv_level_min || "N/A",
          riv_level_max: parseFloat(data.riv_level_max) || data.riv_level_max || "N/A",
          riv_level_avg: parseFloat(data.riv_level_avg) || data.riv_level_avg || "N/A",
          riv_disch_min: parseFloat(data.riv_disch_min) || data.riv_disch_min || "N/A",
          riv_disch_max: parseFloat(data.riv_disch_max) || data.riv_disch_max || "N/A",
          riv_disch_avg: parseFloat(data.riv_disch_avg) || data.riv_disch_avg || "N/A",
        });


        setPredictions((data.predictions || []).map(Number));


        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const graphData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [
      {
        label: "Predicted Sangli Water Level",
        data: predictions,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "red",
        pointBackgroundColor: "black",
        borderWidth: 2,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "red",
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
          weight: "bold",
        },
        bodyColor: "white",
        backgroundColor: "black",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
          font: {
            size: 16,
            weight: "bold",
          },
          color: "darkred",
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
          color: "green",
        },
        grid: {
          borderColor: "black",
          borderWidth: 2,
        },
      },
      y: {
        title: {
          display: true,
          text: "Predicted Level",
          font: {
            size: 16,
            weight: "bold",
          },
          color: "darkred",
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
          color: "Black",
          stepSize: 20,
        },
        grid: {
          borderColor: "black",
          borderWidth: 4,
        },
        min: 0,
        max: 100,
      },
    },
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleManualPrediction = () => {
    navigate('/predict');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading data, please wait...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <button className="retry-button" onClick={fetchData}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="details-page">
      <header className="head-card">
        <h1 className="header-title">Flood Prediction Model</h1>
        <div>
          <button className="logout-button" onClick={handleManualPrediction} aria-label="Manual Prediction">Manual Prediction</button>
          <button className="logout-button" onClick={handleLogout} aria-label="Logout">Back to Main Dashboard</button>
        </div>
      </header>

      <div className="details-section">
        <div className="details-card">
          <h2>Reservoir Name: Koyna Dam</h2>
          <div className="details-grid">
            <div>
              <strong>Discharge Rate:</strong> {damDetails.discharge_rate} Cumecs
            </div>
            <div>
              <strong>Dam Level:</strong> {damDetails.dam_level} meters
            </div>
            <div>
              <strong>Dam Content:</strong> {damDetails.dam_content} cubic meters
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>River Name: Krishna River</h2>
          <div className="details-grid">
            <div>
              <strong>Min River Level:</strong> {riverDetails.riv_level_min} meters
            </div>
            <div>
              <strong>Max River Level:</strong> {riverDetails.riv_level_max} meters
            </div>
            <div>
              <strong>Avg River Level:</strong> {riverDetails.riv_level_avg} meters
            </div>
            <div>
              <strong>Min River Discharge:</strong> {riverDetails.riv_disch_min} Cumecs
            </div>
            <div>
              <strong>Max River Discharge:</strong> {riverDetails.riv_disch_max} Cumecs
            </div>
            <div>
              <strong>Avg River Discharge:</strong> {riverDetails.riv_disch_avg} Cumecs
            </div>
          </div>
        </div>
      </div>

      <div className="graph-section">
        <h2>Flood Prediction for Upcoming Days</h2>
        {predictions.length > 0 ? (
          <Line data={graphData} options={graphOptions} />
        ) : (
          <p className="no-predictions">No prediction data available.</p>
        )}
      </div>

      <footer className="footer">
        <p>© 2025 Flood Prediction Project | Made with ❤️ by Prateek Rasalkar</p>
      </footer>
    </div>
  );
};

export default DetailsPage;
