import React, { useState } from "react";

export default function GoldLoanPage() {
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
      <h1 className="text-3xl font-bold text-yellow-600 mb-3">🥇 Gold Loan</h1>
      <p className="text-gray-700 mb-6">
        Get instant loan against gold with low interest and quick processing.
      </p>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">📌 Interest Rate</h2>
        <p>Starts from <b>8.00% per annum</b></p>
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
        <li>18 years or above</li>
        <li>No income proof required</li>
        <li>Gold purity 18K–24K</li>
      </ul>

      <div className="bg-green-50 p-5 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-3">📝 Application Steps</h2>
        <ol className="list-decimal ml-5 text-gray-700">
          <li>Bring your gold to branch</li>
          <li>Purity check & valuation</li>
          <li>Loan disbursement</li>
        </ol>

        <button className="btn mt-4 bg-yellow-600 hover:bg-yellow-700 text-white">Start Application</button>
      </div>
    </div>
  );
}
