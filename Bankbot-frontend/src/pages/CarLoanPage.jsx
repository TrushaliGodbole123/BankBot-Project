import React, { useState } from "react";

export default function CarLoanPage() {
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
      <h1 className="text-3xl font-bold text-red-600 mb-3">🚗 Car Loan</h1>
      <p className="text-gray-700 mb-6">
        Finance your new or used car with attractive interest rates.
      </p>

      <div className="bg-red-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">📌 Interest Rate</h2>
        <p>Starts from <b>9.20% per annum</b></p>
      </div>

      {/* EMI */}
      <div className="bg-gray-100 p-5 rounded-xl mb-8 shadow">
        <h2 className="text-xl font-bold mb-3">📊 EMI Calculator</h2>

        <input className="input-loan" type="number" placeholder="Loan Amount" onChange={(e)=>setAmount(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Interest Rate (%)" onChange={(e)=>setRate(e.target.value)} />
        <input className="input-loan" type="number" placeholder="Tenure (Years)" onChange={(e)=>setTenure(e.target.value)} />

        <button className="btn" onClick={calculateEMI}>Calculate EMI</button>

        {emi && <p className="text-lg font-bold mt-3">Your EMI: ₹{emi}</p>}
      </div>

      {/* Eligibility */}
      <h2 className="text-xl font-bold mb-2">✅ Eligibility Criteria</h2>
      <ul className="list-disc ml-5 text-gray-700">
        <li>Minimum salary ₹20,000/month</li>
        <li>Age: 21–60 years</li>
        <li>CIBIL score 700+</li>
      </ul>

      {/* Application Flow */}
      <div className="bg-green-50 p-5 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-3">📝 Apply for Car Loan</h2>
        <ol className="list-decimal ml-5 text-gray-700">
          <li>Fill car details</li>
          <li>Upload salary proof</li>
          <li>Submit application</li>
        </ol>

        <button className="btn mt-4 bg-red-600 hover:bg-red-700 text-white">Start Application</button>
      </div>
    </div>
  );
}
