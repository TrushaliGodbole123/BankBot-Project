import { useParams } from "react-router-dom";

export default function LoanPage() {
  const { type } = useParams();

  const loanData = {
    home: {
      title: "Home Loan",
      description: "Low interest rates, long tenure, minimal documents.",
    },
    personal: {
      title: "Personal Loan",
      description: "Quick approval, flexible EMI, no collateral required.",
    },
    car: {
      title: "Car Loan",
      description: "Up to 100% financing, attractive interest rates.",
    },
    gold: {
      title: "Gold Loan",
      description: "Lowest interest against your gold assets.",
    }
  };

  const loan = loanData[type] || {
    title: "Loan Not Found",
    description: "Please select a valid loan type."
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{loan.title}</h1>
      <p>{loan.description}</p>
    </div>
  );
}
