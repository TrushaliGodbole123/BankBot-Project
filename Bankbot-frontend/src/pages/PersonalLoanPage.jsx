import React, { useState } from "react";

export default function PersonalLoanPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const calculateEMI = () => {
    const P = parseFloat(amount);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    const EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    setEmi(EMI.toFixed(2));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-700 mb-3">💼 Personal Loan</h1>
      <p className="text-gray-700 mb-6">
        Get instant personal loans for education, travel, medical, or emergencies.
      </p>

      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">📌 Interest Rate</h2>
        <p>Starts from <b>10.5% per annum</b></p>
      </div>

      <div className="bg-gray-100 p-5 rounded-xl mb-8 shadow">
        <h2 className="text-xl font-bold mb-3">📊 EMI Calculator</h2>

        <input className="input-loan" type="number" placeholder="Loan Amount" onChange={(e)=>setAmount(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Interest Rate (%)" onChange={(e)=>setRate(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Tenure (Years)" onChange={(e)=>setTenure(e.target.value)} />

        <button className="btn" onClick={calculateEMI}>Calculate EMI</button>

        {emi && <p className="text-lg font-bold mt-3">Your EMI: ₹{emi}</p>}
      </div>

      <h2 className="text-xl font-bold mb-2">✔ Eligibility</h2>
      <ul className="list-disc ml-5 text-gray-700">
        <li>Age 21–55 years</li>
        <li>Income ₹28,000/month</li>
        <li>CIBIL score 680+</li>
      </ul>

      <div className="bg-green-50 p-5 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-3">📝 Application Steps</h2>
        <ol className="list-decimal ml-5 text-gray-700">
          <li>Enter your details</li>
          <li>Upload ID proof</li>
          <li>Submit request</li>
        </ol>

        <button className="btn mt-4 bg-purple-600 hover:bg-purple-700 text-white">
          Start Application
        </button>
      </div>
    </div>
  );
}
