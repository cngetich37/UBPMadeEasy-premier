import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UBPHome from "./components/UBPHome";
import FinanceAct from "./components/FinanceAct";
import AdvertFormat from "./components/AdvertFormat";
import Guide from "./components/Guide";
import FAQS from "./components/FAQs";
import ApplicationProcess from "./components/ApplicationProcess";
import Contact from "./components/Contact";
import NaicsCode from "./components/NaicsCode";
import TermsAndConditions from "./components/TermsAndConditions";
import ProtectedRoute from "./components/ProtectedRoute";
import CombinedSearch from "./components/CombinedSearch";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UBPHome />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/financeact" element={<FinanceAct />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQS />} />
          <Route path="/ubp" element={<CombinedSearch />} />
          <Route path="/advert" element={<AdvertFormat />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/app" element={<ApplicationProcess />} />
          <Route path="/naics" element={<NaicsCode />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/terms" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
