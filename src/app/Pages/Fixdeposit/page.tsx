export default function FDPage() {
  return (
    <div className="flex item-center justify-center h-screen">
      <h1>Fixed Deposit Page</h1>
      <p>This is where you can manage your fixed deposits.</p>
      <form>
        <label>Bank Name:</label>
        <input placeholder="Kotak Mahindra Bank" type="text" name="bankName" required />
        <br />
        <label>principalAmount:</label>
        <input placeholder="100000" type="text" name="principalAmount" required />
        <br />
        <label>interestRate:</label>
        <input placeholder="example:- 7.5%" type="text" name="interestRate" required />
        <br />
        <label>tenure:</label>
        <input placeholder="12 months" type="text" name="tenure" required />
        <br />
        <label>compoundingFrequency:</label>
        <input type="text" placeholder="default 12 months" name="compoundingFrequency" required />
        <br />
        <label>maturityDate:</label>
        <input type="text" placeholder="YYYY-MM-DD" name="maturityDate" required />
        <br />
      </form>
    </div>
  );
}