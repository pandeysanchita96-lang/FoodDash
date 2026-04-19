import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { UserCheck, UserX } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const UserManager = () => {
    const { showNotification } = useNotification();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await adminService.toggleUserActive(userId, !currentStatus);
            showNotification(`User ${!currentStatus ? 'unblocked' : 'blocked'} successfully`, "success");
            fetchUsers();
        } catch (err) {
            showNotification("Failed to update user status", "error");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>User Management</h2>
            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Role</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{user.name}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{user.email}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <span style={{ color: user.active ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                                        {user.active ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <button
                                        onClick={() => handleToggleActive(user.id, user.active)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: user.active ? '#f44336' : '#4caf50',
                                            display: 'flex', alignItems: 'center', gap: '5px'
                                        }}
                                    >
                                        {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                                        {user.active ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
