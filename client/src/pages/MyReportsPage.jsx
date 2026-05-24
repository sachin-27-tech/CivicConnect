import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReports } from "../api/reportApi";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import ReportCard from "../components/ReportCard";

function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await getMyReports();
        setReports(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div className="container page-stack">
      <section className="page-header page-header-row">
        <div>
          <p className="eyebrow-text">Citizen tracking</p>
          <h1>My Reports</h1>
          <p>Track the status of issues you have submitted.</p>
        </div>
        <Link className="button button-primary" to="/report">
          New Report
        </Link>
      </section>

      {loading ? <Loader text="Loading your reports..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error ? (
        <div className="report-grid">
          {reports.length ? (
            reports.map((report) => <ReportCard key={report._id} report={report} />)
          ) : (
            <div className="empty-state">You have not submitted any reports yet.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default MyReportsPage;
