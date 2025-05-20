"use client";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import React from "react";

function BrandPage() {
  const brandPillars = [
    {
      title: "Discover Wine Distributors",
      description: "Order before noon and get your order the next day with our premium delivery service.",
      icon: "fa-truck-fast"
    },
    {
      title: "Wine Trading & Tours",
      description: "Hundreds of curated wines selected with real passion and craftsmanship.",
      icon: "fa-wine-glass"
    },
    {
      title: "Wine for Each Occasion",
      description: "For memorable moments and quality you won't find elsewhere at home prices.",
      icon: "fa-calendar-check"
    },
    {
      title: "Recycled Packaging",
      description: "We use 100% recycled materials to ensure our environmental footprint is minimal.",
      icon: "fa-recycle"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-content">
            <div className="about-title-container">
              <h1 className="about-title">
                What Makes <span className="about-title-highlight">Math&Co</span> Different
              </h1>
              <div className="about-title-underline"></div>
            </div>
            <p className="about-subtitle">
              Where passion for wine meets exceptional craftsmanship
            </p>
            <div className="about-divider"></div>
          </div>
        </div>

        <div className="about-container">
          {/* Brand Pillars with Icons */}
          <section className="about-section">
            <div className="pillars-grid">
              {brandPillars.map((pillar, index) => (
                <div key={index} className="pillar-card">
                  <div className="pillar-icon-container">
                    <i className={`fas ${pillar.icon} pillar-icon`}></i>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-description">{pillar.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Story Section */}
          <section className="about-section">
            <h2 className="section-heading">
              It Started With a Small Idea...
            </h2>
            <div className="story-grid">
              {/* Video Container - Left Side */}
              <div className="story-video-container">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="story-video"
                  poster="/images/video-poster.jpg"
                >
                  <source src="/images/about.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Text Content - Right Side */}
              <div className="story-text-content">
                <div className="story-text-group">
                  <p className="story-text">
                    Mush&Co epitomizes leadership and inclusivity, fostering unity among colleagues, companies, and co-workers.
                  </p>
                  <p className="story-text">
                    The "Co" signifies the essence of togetherness, derived from the Latin word "co" meaning joint or jointly. Mush&Co embraces this spirit of harmony, drawing inspiration from a rich heritage that values unity, leadership, wisdom, and the profound appreciation of life itself.
                  </p>
                  <p className="story-text">
                    Mush&Co is a unique wine business that specializes in bringing the perfect pairing of great wines together. Our carefully curated selection of wines are sure to delight your taste buds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Service Section */}
          <section className="service-section">
            <h2 className="section-heading">
              Our Service Isn't Just Personal, It's Hyper-Personally Exquisite
            </h2>
            <div className="service-grid">
              {/* Text Content - Left Side */}
              <div className="service-text-content">
                <p className="service-text">
                  Mush&Co has diversified its product range to accommodate all categories of the general public while still giving each wine a sophisticated quality taste and the deserved experience of a lifetime.
                </p>
                <p className="service-text">
                  Mush&Co goes above and beyond to provide a premium experience. We offer both premium wines and entry-level quality wines, creating not just a product but a lifestyle.
                </p>
              </div>

              {/* Image Container - Right Side */}
              <div className="service-image-container">
                <img
                  src="/images/about1.jpeg"
                  alt="Mush&Co wine service"
                  className="service-image"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2 className="cta-heading">Savor Our Wines</h2>
            <p className="cta-text">
              Experience the taste of nature with Mush&Co - where every bottle tells a story.
            </p>
            <button className="cta-button">
              Explore Our Collection
            </button>
          </section>

          {/* Contact Form Section */}
          <section className="contact-section">
            <div className="contact-container">
              <div className="contact-header">
                <h2 className="contact-title">Get in Touch With Us</h2>
                <div className="contact-divider"></div>
                <p className="contact-subtitle">
                  Have questions about our wines? Want to plan a special order? Reach out and we'll respond promptly.
                </p>
              </div>

              <form className="contact-form">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">Full Name*</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-select">
                      <option>General Inquiry</option>
                      <option>Wholesale Orders</option>
                      <option>Private Events</option>
                      <option>Wine Recommendations</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message*</label>
                    <textarea
                      rows="4"
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Send Message
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <i className="fas fa-phone-alt contact-icon"></i>
                  <h3 className="contact-info-title">Call Us</h3>
                  <p className="contact-info-text">+27 67 963 4795</p>
                </div>

                <div className="contact-info-card">
                  <i className="fas fa-envelope contact-icon"></i>
                  <h3 className="contact-info-title">Email Us</h3>
                  <p className="contact-info-text">info@mathandco.com</p>
                </div>

                <div className="contact-info-card">
                  <i className="fas fa-map-marker-alt contact-icon"></i>
                  <h3 className="contact-info-title">Visit Us</h3>
                  <p className="contact-info-text">93 Bekker Road, Midrand , Thornhill Office Park</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BrandPage;