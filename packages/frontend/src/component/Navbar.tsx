import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LogOut } from "lucide-react";
import styles from "../style/component/Navbar.module.css";
import Container from "../style/component/ui/Container";
import { AuthContext } from "./components/Authetication/Authcontext";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }; const [showArrow, setShowArrow] = useState(false);

  const handleLoginClick = () => {
    setShowArrow(!showArrow);
  };




  return (
    <nav className={styles.navbar}>
      <Container>
        <div className={styles.navContainer}>
          {/* LEFT: Logo + Links */}
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

          {/* RIGHT: Search + Cart + User */}
          <div className={styles.navright}>
            {/* Search Bar */}
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

            {/* Cart & User */}
            {/* <div className={styles.actions}>
              <Link to="/cart" className={styles.cartBtn}>
                <ShoppingCart />
              </Link>

              {user ? (
                <div className={styles.profileSection}>
                  <span className={styles.userText}>Welcome, {user.email.split("@")[0]}</span>
                  <button className={styles.logoutBtn} onClick={logout}>
                    <LogOut /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className={styles.loginBtn}>
                  <User /> Login
                </Link>
              )}
            </div> */}


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
                      <button className={styles.dropdownItem} onClick={logout}>
                        Logout
                      </button>
                      <Link to="/products" className={styles.dropdownItem}>
                        Products
                      </Link>
                      <Link to="/contact" className={styles.dropdownItem}>
                        Contact Page
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.profileSection}>
                    <Link
                      to="/login"
                      className={styles.loginBtn}
                      onClick={handleLoginClick}
                    >
                      <User /> Login
                    </Link>

                    {showArrow && <span className={styles.arrowIcon}>▼</span>}
                  </div>


                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/login" className={styles.dropdownItem}>
                        User Details
                      </Link>
                      <Link to="/products" className={styles.dropdownItem}>
                        Products
                      </Link>
                      <Link to="/contact" className={styles.dropdownItem}>
                        Contact Page
                      </Link>

                      <Link to="/Logout" className={styles.dropdownItem}>
                        Logout
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>



        {/* MOBILE DROPDOWN MENU */}
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
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
