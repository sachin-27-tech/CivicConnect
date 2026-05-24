import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand">
          <span>CC</span>
          <div>
            <strong>CivicConnect</strong>
            <small>Civic Issue Reporting</small>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && !isAdmin ? <NavLink to="/report">Create Report</NavLink> : null}
          {isAuthenticated && !isAdmin ? <NavLink to="/my-reports">My Reports</NavLink> : null}
          {isAuthenticated && isAdmin ? <NavLink to="/admin">Admin Dashboard</NavLink> : null}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button type="button" className="button button-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="button button-ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="button button-primary">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
