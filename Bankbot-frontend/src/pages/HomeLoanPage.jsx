
import React, { useState } from "react";

export default function HomeLoanPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(amount);
    const monthlyRate = parseFloat(rate) / 12 / 100;
    const months = parseFloat(tenure) * 12;

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    setEmi(emiValue.toFixed(2));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-3">🏠 Home Loan</h1>
      <p className="text-gray-700 mb-6">
        Get your dream home with our low-interest home loans. Check EMI, eligibility, and apply quickly.
      </p>

      {/* Interest Rate */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">📌 Interest Rate</h2>
        <p className="text-gray-700">Starts from <b>8.40% per annum</b></p>
      </div>

      {/* EMI Calculator */}
      <div className="bg-gray-100 p-5 rounded-xl mb-8 shadow">
        <h2 className="text-xl font-bold mb-3">📊 EMI Calculator</h2>

        <input className="input-loan" type="number" placeholder="Loan Amount" onChange={(e)=>setAmount(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Interest Rate (%)" onChange={(e)=>setRate(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Tenure (Years)" onChange={(e)=>setTenure(e.target.value)} />

        <button className="btn" onClick={calculateEMI}>Calculate EMI</button>

        {emi && <p className="text-lg font-bold mt-3">Your EMI: ₹{emi}</p>}
      </div>

      {/* Eligibility */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">✅ Eligibility Criteria</h2>
        <ul className="list-disc ml-5 text-gray-700">
          <li>Minimum age: 21 years</li>
          <li>Minimum monthly income: ₹45,000</li>
          <li>CIBIL score above 700 preferred</li>
          <li>Stable employment or business proof</li>
        </ul>
      </div>

      {/* Application Flow */}
      <div className="bg-green-50 p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">📝 Apply for Home Loan</h2>

        <ol className="list-decimal ml-5 text-gray-700">
          <li>Enter personal details</li>
          <li>Upload income proofs</li>
          <li>Submit application for approval</li>
        </ol>

        <button className="btn mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          Start Application
        </button>
      </div>
    </div>
  );
}
