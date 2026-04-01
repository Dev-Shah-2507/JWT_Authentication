import { Routes, Route } from "react-router-dom"
import FloatingShape from "./auth/FloatingShape.jsx"
import HomePage from "./pages/HomePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPassword from "./pages/forgotPassword.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import ResetPassword from "./pages/ResetPasswordPage.jsx"

import { Dashboard } from "./pages/Dashboard.jsx"

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 
                 flex items-center justify-center relative overflow-hidden"
    >

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </div>
  );
}

export default App;