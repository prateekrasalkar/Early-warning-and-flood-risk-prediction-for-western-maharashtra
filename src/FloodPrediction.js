import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloodPrediction.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.port === "3000" ? "http://127.0.0.1:5000" : "");

const FEATURE_FIELDS = [
  { key: "ankali_hha_2018-2024", label: "ankali_water_level_hha (m)", min: 0.0, max: 538.98 },
  { key: "dudhganga_hha_2018-2025", label: "dudhganga_water_level_hha (m)", min: 0.12, max: 381.47 },
  { key: "mhaisal_hha_2018-2024", label: "mhaisal_water_level_hha (m)", min: 0.0, max: 538.73 },
  { key: "shigaon_hha_2022-2024", label: "shigaon_water_level_hha (m)", min: 536.43, max: 545.09 },
  { key: "shivade_hha_2018-2026", label: "shivade_water_level_hha (m)", min: 568.53, max: 578.24 },
  { key: "warna_hha_2022-2024", label: "warna_water_level_hha (m)", min: 536.43, max: 545.09 },
  { key: "belwade_hqc", label: "belwade_river_hqc (m)", min: 0.2, max: 618.67 },
  { key: "gudhe_hqc", label: "gudhe_river_hqc (m)", min: 0.28, max: 268.51 },
  { key: "ichalkaranji_hqc", label: "ichalkaranji_river_hqc (m)", min: 12.13, max: 2055.96 },
  { key: "kagal_hqc", label: "kagal_river_hqc (m)", min: 0.09, max: 992.33 },
  { key: "panchganga_2018-2025", label: "panchganga_river_hqc (m)", min: 0.0, max: 387.67 },
  { key: "parali_hqc", label: "parali_river_hqc (m)", min: 2.54, max: 247.28 },
  { key: "shigaon_hqc", label: "shigaon_river_hqc (m)", min: 5.33, max: 2270.02 },
  { key: "shivade_hqc", label: "shivade_river_hqc (m)", min: 0.14, max: 1120.45 },
  { key: "surul_hqc", label: "surul_river_hqc (m)", min: 1.38, max: 176.02 },
  { key: "Dudhganga-River-Downstream-HHS", label: "dudhganga_river_hhs (m)", min: 530.99, max: 541.25 },
  { key: "Kera-River-Upstream-HHS", label: "kera_river_hhs (m)", min: 572.16, max: 576.2 },
  { key: "morna", label: "morna_river_hhs (m)", min: 96.72, max: 568.82 },
  { key: "Panchganga-River-Downstream-HHS", label: "panchganga_river_hhs (m)", min: 528.45, max: 541.45 },
  { key: "Yerala-River-Upstream-HHS", label: "yerala_river_hhs (m)", min: 0.0, max: 674.44 },
];

function FloodPrediction() {
  const navigate = useNavigate();
  const initialFeatureState = useMemo(
    () => Object.fromEntries(FEATURE_FIELDS.map((field) => [field.key, ""])),
    []
  );
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [date, setDate] = useState("");
  const [featureValues, setFeatureValues] = useState(initialFeatureState);
  const [featureMetadata, setFeatureMetadata] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getFieldLabel = (field) => field.label.replace(" (m)", "");

  useEffect(() => {
    fetch(`${API_BASE}/predict-metadata`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Unable to load field guidance."))))
      .then((data) => {
        setFeatureMetadata(data.feature_ranges || {});
      })
      .catch(() => {
        setFeatureMetadata({});
      });
  }, []);

  const handleChange = (field, value) => {
    setFeatureValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setDate("");
    setFeatureValues(initialFeatureState);
    setPredictionResult(null);
    setError("");
  };

  const getFieldHint = (field) => {
    const meta = featureMetadata[field.key];
    if (!meta) {
      return "Enter a recent station reading.";
    }
    const readingType = meta.reading_type || "station reading";
    const p05 = typeof meta.p05 === "number" ? meta.p05.toFixed(2) : null;
    const p95 = typeof meta.p95 === "number" ? meta.p95.toFixed(2) : null;
    if (p05 && p95) {
      return `${readingType}. Typical observed range: ${p05} to ${p95}.`;
    }
    return `${readingType}.`;
  };

  const getFieldWarning = (field) => {
    const rawValue = featureValues[field.key];
    if (rawValue === "") {
      return "";
    }
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) {
      return "";
    }
    const meta = featureMetadata[field.key];
    if (!meta) {
      return "";
    }
    if (typeof meta.p95 === "number" && numericValue > meta.p95) {
      return `Above typical observed range. Most values stayed below ${meta.p95.toFixed(2)}.`;
    }
    if (typeof meta.p05 === "number" && numericValue < meta.p05) {
      return `Below typical observed range. Most values stayed above ${meta.p05.toFixed(2)}.`;
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPredictionResult(null);

    if (!date) {
      setError("Please select the input date.");
      return;
    }

    const hasEmptyFields = FEATURE_FIELDS.some((field) => featureValues[field.key] === "");
    if (hasEmptyFields) {
      setError("Please enter numeric values for all model inputs.");
      return;
    }

    const numericFeatureValues = Object.fromEntries(
      FEATURE_FIELDS.map((field) => [field.key, Number(featureValues[field.key])])
    );

    if (Object.values(numericFeatureValues).some((value) => Number.isNaN(value))) {
      setError("All model inputs must be valid numeric values.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          feature_values: numericFeatureValues,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setPredictionResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flood-prediction-page">
      <header className="flood-prediction-header">
        <h1 className="flood-prediction-title">Flood Prediction</h1>
        <div className="flood-prediction-actions">
          <button
            type="button"
            className="secondary-button ghost-button"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
        </div>
      </header>

      <section className="flood-prediction-container">
        <p className="flood-prediction-subtitle">
          Enter the latest station readings. Manual prediction now uses a
          weighted dominant-river flood score with stricter multi-river
          confirmation to reduce false alarms.
        </p>
        <p className="helper-text">
          These fields are mixed station readings such as HHA, HQC, and HHS, so
          they are not all the same physical unit. Use recent station-like values
          and compare against the typical observed range shown below each field.
        </p>
        <form onSubmit={handleSubmit} className="flood-prediction-form">
          <label className="date-field">
            <span>Input Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="flood-prediction-input"
              max={today}
              required
            />
          </label>

          <div className="feature-grid">
            {FEATURE_FIELDS.map((field) => (
              <label key={field.key} className="feature-field">
                <span>{getFieldLabel(field)}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={featureValues[field.key]}
                  onChange={(event) => handleChange(field.key, event.target.value)}
                  placeholder={`Enter ${field.label}`}
                  className="flood-prediction-input"
                  required
                />
                <small className="field-hint">{getFieldHint(field)}</small>
                {getFieldWarning(field) ? (
                  <small className="field-warning">{getFieldWarning(field)}</small>
                ) : null}
              </label>
            ))}
          </div>

          <button type="submit" className="flood-prediction-button" disabled={loading}>
            {loading ? "Predicting..." : "Predict Flood"}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}

        {predictionResult ? (
          <div className="flood-prediction-result">
            <h2>Prediction Result</h2>
            <p>
              <strong>Status:</strong> {predictionResult.status_message}
            </p>
            <p>
              <strong>Prediction Date:</strong> {predictionResult.prediction_date}
            </p>
            <p>
              <strong>Predicted Probability:</strong>{" "}
              {Number(predictionResult.predicted_probability).toFixed(4)}
            </p>
            <p>
              <strong>Predicted Class:</strong>{" "}
              {predictionResult.predicted_class === 1 ? "Flood" : "No Flood"}
            </p>
            <p>
              <strong>Flood Threshold:</strong>{" "}
              {Number(predictionResult.flood_threshold).toFixed(4)}
            </p>
            <p>
              <strong>Decision Threshold:</strong>{" "}
              {Number(predictionResult.decision_threshold).toFixed(4)}
            </p>
            {predictionResult.manual_trigger_count !== undefined ? (
              <p>
                <strong>Supporting Rivers Triggered:</strong>{" "}
                {predictionResult.manual_trigger_count}
              </p>
            ) : null}
            {predictionResult.out_of_range_warnings?.length ? (
              <div className="prediction-explanation">
                <h3>Input Warnings</h3>
                {predictionResult.out_of_range_warnings.map((item) => (
                  <p key={`${item.feature}-${item.direction}`}>
                    <strong>{item.feature}:</strong> current value {Number(item.current_value).toFixed(2)} is
                    {" "}
                    {item.direction === "high" ? "above" : "below"} the typical observed
                    {" "}
                    {item.direction === "high" ? `p95 ${Number(item.typical_p95).toFixed(2)}` : `p05 ${Number(item.typical_p05).toFixed(2)}`}.
                  </p>
                ))}
              </div>
            ) : null}
            {predictionResult.reference_profile_name ? (
              <div className="prediction-explanation">
                <h3>Verified Flood Pattern Match</h3>
                <p>
                  <strong>Matched Profile:</strong> {predictionResult.reference_profile_name}
                </p>
                <p>
                  <strong>Profile Match Score:</strong>{" "}
                  {Number(predictionResult.reference_profile_match_score || 0).toFixed(4)}
                </p>
              </div>
            ) : null}
            {predictionResult.top_contributors?.length ? (
              <div className="prediction-explanation">
                <h3>Why This Result</h3>
                {predictionResult.top_contributors.map((item) => (
                  <p key={item.feature}>
                    <strong>{item.feature}:</strong> current {Number(item.current_value).toFixed(2)}, typical median{" "}
                    {item.typical_median !== null ? Number(item.typical_median).toFixed(2) : "NA"}, typical p95{" "}
                    {item.typical_p95 !== null ? Number(item.typical_p95).toFixed(2) : "NA"}, correlation weight{" "}
                    {Number(item.correlation_weight).toFixed(2)}, influence score {Number(item.risk_score).toFixed(2)}.
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default FloodPrediction;
