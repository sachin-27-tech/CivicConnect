import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../api/reportApi";
import ErrorMessage from "../components/ErrorMessage";
import IssueMap from "../components/IssueMap";
import Loader from "../components/Loader";
import ReportCard from "../components/ReportCard";
import StatisticsCards from "../components/StatisticsCards";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load civic issues.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Reports", value: reports.length },
      { label: "Pending", value: reports.filter((report) => report.status === "Pending").length },
      { label: "In Progress", value: reports.filter((report) => report.status === "In Progress").length },
      { label: "Resolved", value: reports.filter((report) => report.status === "Resolved").length }
    ],
    [reports]
  );

  const recentReports = reports.slice(0, 6);

  return (
    <div className="container page-stack">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow-text">Citizen service platform</p>
          <h1>CivicConnect</h1>
          <p>
            Report potholes, garbage overflow, broken streetlights, water leakage, and public infrastructure
            problems with photo and location evidence.
          </p>
          <div className="hero-actions">
            {isAuthenticated && !isAdmin ? (
              <Link className="button button-primary" to="/report">
                Report an Issue
              </Link>
            ) : (
              <Link className="button button-primary" to="/register">
                Create Citizen Account
              </Link>
            )}
            {isAuthenticated && isAdmin ? (
              <Link className="button button-secondary" to="/admin">
                Open Admin Dashboard
              </Link>
            ) : (
              <Link className="button button-secondary" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="hero-panel">
          <strong>Simple Workflow</strong>
          <p>Submit a report, attach a photo, capture your location, and track status from pending to resolved.</p>
        </div>
      </section>

      <StatisticsCards stats={stats} />

      {loading ? <Loader text="Loading issue overview..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error ? (
        <>
          <section className="section-block">
            <div className="section-heading">
              <h2>Interactive Issue Map</h2>
              <p>Explore submitted reports by location. Select a marker to view title, category, and status.</p>
            </div>
            <IssueMap reports={reports} />
          </section>

          <section className="section-block">
            <div className="section-heading">
              <h2>Recent Issues</h2>
              <p>Latest civic issues reported by citizens.</p>
            </div>
            <div className="report-grid">
              {recentReports.length ? (
                recentReports.map((report) => <ReportCard key={report._id} report={report} />)
              ) : (
                <div className="empty-state">No reports have been submitted yet.</div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

export default HomePage;
