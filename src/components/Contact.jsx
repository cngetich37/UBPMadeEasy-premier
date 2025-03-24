import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post("https://effortlessubp-backend.onrender.com/api/users/send-email", formData);
      setAlert({ type: "success", message: "Your message has been sent successfully." });
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      setAlert({ type: "error", message: "Error sending message. Try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback - Give Feedback | UBPMadeEasy</title>
        <meta name="description" content="Share your feedback anonymously. Contact us for inquiries, suggestions, or support." />
      </Helmet>

      <main className="flex flex-col justify-center items-center min-h-screen bg-[#D72638] p-6">
        <section className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#D72638]">Give Feedback</h1>
              <p className="text-gray-600">Your opinion matters to us.</p>
            </header>

            {alert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-2 p-4 mb-4 rounded-lg border ${
                  alert.type === "success"
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-red-100 border-red-500 text-red-800"
                }`}
              >
                {alert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{alert.message}</span>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-[#D72638] font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D72638]"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              <div>
                <label htmlFor="email" className="block text-[#D72638] font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D72638]"
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="message" className="block text-[#D72638] font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D72638]"
                />
                {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message}</div>}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-[#D72638] text-[#FFD700] font-semibold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default Contact;
