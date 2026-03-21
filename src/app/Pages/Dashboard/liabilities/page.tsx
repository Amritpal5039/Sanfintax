'use client'
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Liability(){
    const [ liabilities, setLiabilities] = useState<any[]>([]);
    const [formopen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', type: '', principalAmount: '', outstandingAmount: '', interestRate: '', emiAmount: '', startDate: '', endDate: '', lenderName: '', notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const createliability = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/liabilities", formData);
            if (response.data.success) {
                setLiabilities([...liabilities, response.data.data]);
                setFormOpen(false);
                setFormData({name: '', type: '', principalAmount: '', outstandingAmount: '', interestRate: '', emiAmount: '', startDate: '', endDate: '', lenderName: '', notes: ''});
            }
        } catch (error) {
            console.error("Error creating liability:", error);
        }
    }

    const updateliability = async ( id: string) => {
        try {
            const response = await axios.put(`/api/liabilities/${id}`, formData); // Will need dynamic payload in a full implementation
            if (response.data.success) {
                // Update local list...
                setLiabilities(liabilities.map(l => l._id === id ? response.data.data : l));
            }
        } catch (error) {
            console.error("Error updating liability:", error);
        }
    }

    const deleteliability = async (id: string) => {
        try {
            const response = await axios.delete(`/api/liabilities/${id}`);
            if (response.data.success) {
                setLiabilities(liabilities.filter((l) => l._id !== id));
            }
        } catch (error) {
            console.error("Error deleting liability:", error);
        }
    }

    useEffect(() => {
        const fetchLiabilities = async () => {
            try {
                const response = await axios.get("/api/liabilities");
                if (response.data.success) {
                    setLiabilities(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching liabilities:", error);
            }
        };
        fetchLiabilities();
    }, []);

    return(
        <div>
            <h1>Liabilities</h1>
            <button onClick={()=>setFormOpen(!formopen)}>{formopen ? "Cancel" : "Create Liability"}</button>
            {formopen && (
                <form onSubmit={createliability} style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px 0'}}>
                    <input type="text" name="name" placeholder="Name (e.g. Home Loan - SBI)" value={formData.name} onChange={handleChange} required />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="home_loan">Home Loan</option>
                        <option value="car_loan">Car Loan</option>
                        <option value="personal_loan">Personal Loan</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="education_loan">Education Loan</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="number" name="principalAmount" placeholder="Principal Amount" value={formData.principalAmount} onChange={handleChange} required min="0" />
                    <input type="number" name="outstandingAmount" placeholder="Outstanding Amount" value={formData.outstandingAmount} onChange={handleChange} required min="0" />
                    <input type="number" name="interestRate" placeholder="Interest Rate %" value={formData.interestRate} onChange={handleChange} required min="0" step="0.01" />
                    <input type="number" name="emiAmount" placeholder="EMI Amount" value={formData.emiAmount} onChange={handleChange} required min="0" />
                    <label style={{fontSize: '0.8rem', color: '#666'}}>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    <label style={{fontSize: '0.8rem', color: '#666'}}>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                    <input type="text" name="lenderName" placeholder="Lender Name" value={formData.lenderName} onChange={handleChange} required />
                    <input type="text" name="notes" placeholder="Remarks/Notes (Optional)" value={formData.notes} onChange={handleChange} />
                    <button type="submit">Save Liability</button>
                </form>
            )}
            
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px'}}>
                {liabilities.map((liability: any) => (
                    <div key={liability._id} style={{border: "1px solid #ccc", padding: "15px", borderRadius: "8px", minWidth: "250px"}}>
                        <h3>{liability.name}</h3>
                        <p><strong>Type:</strong> {liability.type.replace('_', ' ')}</p>
                        <p><strong>Lender:</strong> {liability.lenderName}</p>
                        <p><strong>Principal:</strong> ₹{liability.principalAmount}</p>
                        <p><strong>Outstanding:</strong> ₹{liability.outstandingAmount}</p>
                        <p><strong>Interest Rate:</strong> {liability.interestRate}%</p>
                        <p><strong>EMI:</strong> ₹{liability.emiAmount}</p>
                        <p><strong>Period:</strong> {new Date(liability.startDate).toLocaleDateString()} to {new Date(liability.endDate).toLocaleDateString()}</p>
                        {liability.notes && <p><strong>Notes:</strong> {liability.notes}</p>}
                        <button onClick={() => deleteliability(liability._id)} style={{marginTop: '10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                    </div>
                ))}
            </div>
            {liabilities.length === 0 && !formopen && <p>No liabilities found. Create one!</p>}
        </div>
    )
}