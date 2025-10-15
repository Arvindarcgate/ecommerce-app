import React, { useState } from "react";
import styles from "../style/pages/contact.module.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted ✅", formData);
  };

  return (
    <div className={styles.contactPage}>
      <h1 className={styles.heading}>Discover Amazing Contact</h1>

      <div className={styles.mainHeading}>
        <h3>Contact us</h3>
        <p>Have a question or need help? We'd love to hear from you.</p>
      </div>

      <div className={styles.contactContainer}>
        {/* Left Side: Form */}
        <div className={styles.formContainer}>
          <h4>Send us a message</h4>
          <p>
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                rows={4}
                required
              />
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Right Side: Contact Info + FAQ */}
        <div className={styles.contactInfo}>
          <h3>Contact Information</h3>
          <div className={styles.infoItem}>
            <h4>Address</h4>
            <p>
              123 Commerce Street <br />
              Business District <br />
              City, State 12345
            </p>
          </div>

          <div className={styles.infoItem}>
            <h4>Phone</h4>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className={styles.infoItem}>
            <h4>Email</h4>
            <p>support@ecommerce.com</p>
          </div>

          <div className={styles.infoItem}>
            <h4>Business Hours</h4>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM <br />
              Saturday: 10:00 AM - 4:00 PM <br />
              Sunday: Closed
            </p>
          </div>

          {/* FAQ */}
          <div className={styles.faq}>
            <h3>Frequently Asked Questions</h3>

            <div className={styles.faqItem}>
              <h4>How long does shipping take?</h4>
              <p>
                Standard shipping takes 3-5 business days, while express shipping
                takes 1-2 business days.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4>What's your return policy?</h4>
              <p>
                We offer a 30-day return policy for all items in original
                condition.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4>Do you offer international shipping?</h4>
              <p>
                Yes, we ship to most countries worldwide. Shipping costs vary by
                location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
