import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const VendorApproval = () => {
    const { showNotification } = useNotification();
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const data = await adminService.getAllVendors();
            setVendors(data);
        } catch (err) {
            console.error("Failed to fetch vendors", err);
        }
    };

    const handleApprove = async (vendorId, status) => {
        try {
            await adminService.approveVendor(vendorId, status);
            showNotification(`Vendor ${status ? 'approved' : 'suspended'} successfully`, "success");
            fetchVendors();
        } catch (err) {
            showNotification("Failed to update approval status", "error");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Vendor Approval & Management</h2>
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {vendors.map(vendor => (
                    <div key={vendor.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', backgroundColor: 'white', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>{vendor.businessName}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 10px 0' }}>{vendor.user.email}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {vendor.approved ?
                                    <span style={{ color: '#4caf50', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldCheck size={16} /> Approved</span> :
                                    <span style={{ color: '#ff9800', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldAlert size={16} /> Pending</span>
                                }
                            </div>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '15px' }}>
                            <div><strong>Address:</strong> {vendor.address}</div>
                            <div><strong>Phone:</strong> {vendor.phone}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            {!vendor.approved ? (
                                <button
                                    onClick={() => handleApprove(vendor.id, true)}
                                    style={{ flex: 1, padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                >
                                    <Check size={18} /> Approve
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleApprove(vendor.id, false)}
                                    style={{ flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                >
                                    <X size={18} /> Reject/Suspand
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorApproval;
