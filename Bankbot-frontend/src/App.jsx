
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Chat from "./components/chat.jsx";
// import LoanPage from "./pages/LoanPage";
// import BotMessage from './components/BotMessage.jsx';
// import HomeLoanPage from "./pages/HomeLoanPage.jsx";
// import PersonalLoanPage from "./pages/PersonalLoanPage.jsx";
// import CarLoanPage from "./pages/CarLoanPage.jsx";
// import GoldLoanPage from "./pages/GoldLoanPage.jsx";
// import UserLogin from "./components/UserLogin";
// import AdminLogin from "./components/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <Router>
//       <div>
//         <Chat />

//         {/* ✅ Correct routing (NO nested Routes) */}
//         <Routes>
//           <Route path="/" element={<UserLogin />} />
//           <Route path="/loan/:type" element={<LoanPage />} />
//           <Route path="/loan/home" element={<HomeLoanPage />} />
//           <Route path="/loan/personal" element={<PersonalLoanPage />} />
//           <Route path="/loan/car" element={<CarLoanPage />} />
//           <Route path="/loan/gold" element={<GoldLoanPage />} />
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
          

//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Chat from "./components/chat.jsx";
import LoanPage from "./pages/LoanPage";
import BotMessage from './components/BotMessage.jsx';

import HomeLoanPage from "./pages/HomeLoanPage.jsx";
import PersonalLoanPage from "./pages/PersonalLoanPage.jsx";
import CarLoanPage from "./pages/CarLoanPage.jsx";
import GoldLoanPage from "./pages/GoldLoanPage.jsx";

import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Signup from "./components/Signup.jsx";

function App() {
  return (
    <Router>
      <Routes>

        {/* USER LOGIN */}
        <Route path="/" element={<UserLogin />} />

        {/* CHAT – ONLY SHOW CHATBOT HERE */}
        <Route path="/chat" element={<Chat />} />

        {/* LOAN PAGES */}
        <Route path="/loan/:type" element={<LoanPage />} />
        <Route path="/loan/home" element={<HomeLoanPage />} />
        <Route path="/loan/personal" element={<PersonalLoanPage />} />
        <Route path="/loan/car" element={<CarLoanPage />} />
        <Route path="/loan/gold" element={<GoldLoanPage />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

export default App;
