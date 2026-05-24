import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { imageBaseUrl } from "../api/reportApi";
import StatusBadge from "./StatusBadge";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function IssueMap({ reports }) {
  const reportsWithLocation = reports.filter((report) => report.latitude && report.longitude);
  const defaultCenter = reportsWithLocation.length
    ? [reportsWithLocation[0].latitude, reportsWithLocation[0].longitude]
    : [20.5937, 78.9629];

  return (
    <div className="map-wrapper">
      <MapContainer
        key={`${defaultCenter.join("-")}-${reportsWithLocation.length}`}
        center={defaultCenter}
        zoom={reportsWithLocation.length ? 12 : 5}
        scrollWheelZoom
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reportsWithLocation.map((report) => (
          <Marker key={report._id} position={[report.latitude, report.longitude]}>
            <Popup>
              <div className="map-popup">
                <strong>{report.title}</strong>
                <p>Category: {report.category}</p>
                <StatusBadge status={report.status} />
                {report.image ? (
                  <img src={`${imageBaseUrl}${report.image}`} alt={report.title} className="popup-image" />
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default IssueMap;
