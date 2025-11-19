import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Search, LogOut } from "lucide-react";
import styles from "../style/component/Navbar.module.css";
import Container from "../style/component/ui/Container";
import { AuthContext } from "./components/Authetication/Authcontext";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: "Home", href: "/Home" },
    { name: "Products", href: "/productpage" },
    { name: "Contact", href: "/contact" },
    { name: "Cart", href: "/cart" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className={styles.navbar}>
      <Container>
        <div className={styles.navContainer}>
          {/* LEFT: Logo + Navigation Links */}
          <div className={styles.navleft}>
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

          {/* RIGHT SECTION */}
          <div className={styles.navright}>
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
            <div className={styles.profileSection}>
              {user ? (
                <>
                  <span
                    className={styles.userText}
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                  >
                    Welcome, {user.email.split("@")[0]} ▼
                  </span>

                  {isDropdownOpen && (
                    <div
                      className={styles.dropdownMenu}
                      data-testid="dropdown-menu"
                    >
                      <Link
                        to="/user-details"
                        className={styles.dropdownItem}
                        onClick={closeDropdown}
                      >
                        User Details
                      </Link>

                      <Link
                        to="/productpage"
                        className={styles.dropdownItem}
                        onClick={closeDropdown}
                      >
                        Products
                      </Link>

                      <Link
                        to="/contact"
                        className={styles.dropdownItem}
                        onClick={closeDropdown}
                      >
                        Contact
                      </Link>

                      <Link
                        to="/cart"
                        className={styles.dropdownItem}
                        onClick={closeDropdown}
                      >
                        Cart
                      </Link>

                      <button
                        className={styles.dropdownItem}
                        onClick={() => {
                          logout();
                          closeDropdown();
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className={styles.loginBtn}>
                  <User /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
