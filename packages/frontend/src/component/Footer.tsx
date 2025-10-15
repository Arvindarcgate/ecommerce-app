import React from "react";
import styles from "../style/component/Footer.module.css";
import Container from "../style/component/ui/Container";



import {
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: "black", display: "flex" }}>
      <Container>
        <div className={styles.divone}>
          <div className={styles.divhorizontal}>
            <h4>E-commerce</h4>
            <p>
              Your trusted partner for premium products <br />
              and exceptional shopping experiences. <br /> Quality guaranteed,
              satisfaction delivered.
            </p>
            <div className={styles.iconsocial}>
              <Facebook data-testid="icon-facebook" />
              <Twitter data-testid="icon-twitter" />
              <Instagram data-testid="icon-instagram" />
              <Youtube data-testid="icon-youtube" />
            </div>
          </div>

          <div className={styles.links}>
            <h4>Quick Links</h4>
            <p>Home</p>
            <p>Product</p>
            <p>Contact</p>
            <p>Cart</p>
          </div>

          <div className={styles.customerService}>
            <h4>Customer Services</h4>
            <p>F&Q</p>
            <p>Shipping Info</p>
            <p>Returns</p>
            <p>Size Guide</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>

          <div className={styles.contactus}>
            <h4>Contact Us</h4>
            <p>
              <MapPin className={styles.iconMapPin} size={14} />
              Location: 123 Commerce St, Business District, NY 10001
            </p>
            <p>
              <Phone className={styles.iconphone} size={16} />
              +1 (555) 123-4567
            </p>
            <p>
              <Mail className={styles.iconMail} size={14} />
              support@ecommerce.com
            </p>
          </div>
        </div>
        <hr className={styles.footerLine} />
        <div className={styles.divtwo}>
          <p>© 2024 ECommerce. All rights reserved.</p>
          <div className={styles.terms}>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Cookie Policy</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
