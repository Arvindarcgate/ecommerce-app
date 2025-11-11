import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LogOut } from "lucide-react";
import styles from "../style/component/Navbar.module.css";
import Container from "../style/component/ui/Container";
import { AuthContext } from "./components/Authetication/Authcontext";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/productpage" },
    { name: "Contact", href: "/contact" },
    { name: "Cart", href: "/cart" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className={styles.navbar}>
      <Container>
        <div className={styles.navContainer}>
          {/* LEFT: Logo + Nav Links */}
          <div className={styles.navLeft}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>E</div>
              <span className={styles.logoText}>ECommerce</span>
            </Link>

            <div className={styles.navLinks}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Search + User + Mobile Menu */}
          <div className={styles.navRight}>
            {/* Search */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* User / Auth Section */}
            <div className={styles.profileSection} onClick={toggleDropdown}>
              {user ? (
                <>
                  <span className={styles.userText}>
                    Welcome, {user.email.split("@")[0]}
                  </span>
                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/user-details" className={styles.dropdownItem}>
                        User Details
                      </Link>
                      <Link to="/productpage" className={styles.dropdownItem}>
                        Products
                      </Link>
                      <Link to="/contact" className={styles.dropdownItem}>
                        Contact
                      </Link>
                      <Link to="/cart" className={styles.dropdownItem}>
                        Cart
                      </Link>
                      <button className={styles.dropdownItem} onClick={logout}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.loginBtn}>
                    <User size={18} /> Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className={styles.mobileSearch}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className={styles.mobileLogoutBtn}
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={styles.mobileLoginBtn}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={16} /> Login
              </Link>
            )}
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
