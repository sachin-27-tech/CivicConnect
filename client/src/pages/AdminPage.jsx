import { useEffect, useMemo, useState } from "react";
import { getAdminStats, getReports, updateReportStatus } from "../api/reportApi";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import StatisticsCards from "../components/StatisticsCards";
import StatusBadge from "../components/StatusBadge";
import { CATEGORIES, STATUSES } from "../services/constants";

function AdminPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDashboard = async (params = filters) => {
    try {
      setLoading(true);
      const [reportData, statsData] = await Promise.all([getReports(params), getAdminStats()]);
      setReports(reportData);
      setStats(statsData);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = useMemo(
    () => [
      { label: "Total Reports", value: stats?.totalReports ?? 0 },
      { label: "Pending", value: stats?.pendingReports ?? 0 },
      { label: "In Progress", value: stats?.inProgressReports ?? 0 },
      { label: "Resolved", value: stats?.resolvedReports ?? 0 }
    ],
    [stats]
  );

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    loadDashboard(filters);
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      await updateReportStatus(reportId, status);
      setMessage("Report status updated.");
      await loadDashboard(filters);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update report status.");
    }
  };

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow-text">Admin control</p>
        <h1>Admin Dashboard</h1>
        <p>Review reports, filter issue activity, and update statuses.</p>
      </section>

      <StatisticsCards stats={summary} />
      {message ? <div className="success-message">{message}</div> : null}
      {loading ? <Loader text="Loading dashboard..." /> : null}
      <ErrorMessage message={error} />

      <section className="dashboard-panel">
        <form className="filters" onSubmit={applyFilters}>
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search title or description"
          />
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="button button-primary" type="submit">
            Apply
          </button>
        </form>

        {!loading && !error ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Citizen</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {reports.length ? (
                  reports.map((report) => (
                    <tr key={report._id}>
                      <td>
                        <strong>{report.title}</strong>
                        <small>{report.location?.address || `${report.latitude}, ${report.longitude}`}</small>
                      </td>
                      <td>{report.createdBy?.name || "Citizen"}</td>
                      <td>{report.category}</td>
                      <td>
                        <StatusBadge status={report.status} />
                      </td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select value={report.status} onChange={(event) => handleStatusChange(report._id, event.target.value)}>
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No reports match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AdminPage;
