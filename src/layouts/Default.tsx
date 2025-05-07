import { Link, useNavigate } from "react-router";
import { useState, type FormEvent } from "react";

function Layout({ children }: React.PropsWithChildren) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <Link to="/" className="logo">RecipeFinder</Link>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            aria-label="Search recipes"
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} RecipeFinder. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default Layout;