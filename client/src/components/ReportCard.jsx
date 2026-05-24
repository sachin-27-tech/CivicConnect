import { imageBaseUrl } from "../api/reportApi";
import StatusBadge from "./StatusBadge";

function ReportCard({ report }) {
  return (
    <article className="report-card">
      {report.image ? (
        <img className="report-image" src={`${imageBaseUrl}${report.image}`} alt={report.title} />
      ) : (
        <div className="report-image image-placeholder">No Image</div>
      )}

      <div className="card-body">
        <div className="card-row">
          <div>
            <p className="eyebrow-text">{report.category}</p>
            <h3>{report.title}</h3>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <p className="report-description">{report.description}</p>
        {report.location?.address ? <p className="meta-text">{report.location.address}</p> : null}

        <div className="report-meta-grid">
          <p className="meta-pill">{new Date(report.createdAt).toLocaleDateString()}</p>
          <p className="meta-pill">
            {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default ReportCard;
