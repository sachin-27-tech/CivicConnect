import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../api/reportApi";
import ErrorMessage from "../components/ErrorMessage";
import { CATEGORIES } from "../services/constants";

const initialForm = {
  title: "",
  description: "",
  category: "Road Damage",
  image: null,
  latitude: "",
  longitude: "",
  address: ""
};

function CreateReportPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setMessage("Location captured successfully.");
        setLocating(false);
      },
      () => {
        setError("Could not detect location. Please allow location access or enter coordinates manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });

      await createReport(payload);
      navigate("/my-reports", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow-text">Citizen report</p>
        <h1>Create Report</h1>
        <p>Submit a civic issue with a clear description, photo, and exact location.</p>
      </section>

      <div className="two-column">
        <form className="form-card" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          {message ? <div className="success-message">{message}</div> : null}

          <label>
            Issue Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" required />
          </label>

          <div className="form-grid">
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Photo
              <input type="file" name="image" accept="image/*" onChange={handleChange} required />
            </label>
          </div>

          <div className="location-panel">
            <div>
              <strong>Location</strong>
              <p>Use your current device location or enter coordinates manually.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={detectLocation} disabled={locating}>
              {locating ? "Detecting..." : "Use Current Location"}
            </button>
          </div>

          <div className="form-grid">
            <label>
              Latitude
              <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange} required />
            </label>
            <label>
              Longitude
              <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Location Note
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              placeholder="Nearby landmark or address"
            />
          </label>

          <button className="button button-primary full-width" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        <aside className="info-panel">
          <h2>Good reports help admins act faster</h2>
          <ul>
            <li>Use a short title that names the issue.</li>
            <li>Attach a clear photo of the problem.</li>
            <li>Capture location while standing near the issue.</li>
            <li>Add a landmark if the location is hard to identify.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default CreateReportPage;
