"use client";
import Footer from "../../../components/footer";
import React, { useState } from "react";
import Navbar from "../../../components/navbar";

function MainComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("Sending...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Full-width header section */}
      <div className="w-full bg-gradient-to-r from-[#d4b26a] to-black text-white py-16 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
              Contact <span className="text-[#d4b26a]">Us</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
            We'd love to hear from you - reach out for inquiries, tastings, or just to say hello
          </p>
          <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-crimson-text mb-4">
                  Tasting Room Hours
                </h2>
                <div className="space-y-2">
                  <p>Monday - Friday: 08:00 AM - 17:00 PM</p>
                  <p>Friday - Sunday: 10:00 AM - 8:00 PM</p>
                  <p className="italic">
                    Last tasting begins 1 hour before closing
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-crimson-text mb-4">Location</h2>
                <p>93 Bekker Road, Thornhill Office Park</p>
                <p>Midrand, Pretoria</p>
              </div>

              <div>
                <h2 className="text-2xl font-crimson-text mb-4">
                  Contact Information
                </h2>
                <p>
                  <i className="fas fa-phone mr-2"></i>+27 67 963 4795
                </p>
                <p>
                  <i className="fas fa-envelope mr-2"></i>info@mathandco.co.za
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-crimson-text mb-4">Follow Us</h2>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    className="text-2xl hover:text-[#d4b26a] transition-colors"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-2xl hover:text-[#d4b26a] transition-colors"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    className="text-2xl hover:text-[#d4b26a] transition-colors"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-crimson-text mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#d4b26a] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#d4b26a] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#d4b26a] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#d4b26a] focus:border-transparent transition-all"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#d4b26a] text-white px-6 py-3 rounded hover:bg-[#c4a25a] transition-colors font-medium"
                >
                  Send Message
                </button>
                {submitStatus && (
                  <p
                    className={`mt-2 ${submitStatus.includes("success")
                      ? "text-green-600"
                      : "text-red-600"}`}
                  >
                    {submitStatus}
                  </p>
                )}
              </form>
            </section>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-crimson-text mb-6">Find Us</h2>
            <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d201064.11671420533!2d-122.42675464725952!3d38.29633895730338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80845c1f88fdfd8b%3A0xc428d9arrival%21Napa+Valley!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Winery Location Map"
              ></iframe>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default MainComponent;