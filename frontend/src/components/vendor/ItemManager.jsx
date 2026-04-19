import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';
import { Plus, Edit2, Trash2, X, Package, Tag, Check } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { getItemImage } from '../../utils/imageUtils';

const ItemManager = () => {
    const { showNotification } = useNotification();
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true,
        calories: '',
        protein: '',
        fat: '',
        carbs: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await itemService.getVendorItems();
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch items", err);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                imageUrl: '',
                available: true,
                calories: '',
                protein: '',
                fat: '',
                carbs: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await itemService.updateItem(editingItem.id, formData);
            } else {
                await itemService.addItem(formData);
            }
            setIsModalOpen(false);
            showNotification(`Item ${editingItem ? 'updated' : 'added'} successfully!`, "success");
            fetchItems();
        } catch (err) {
            showNotification("Failed to save item", "error");
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await itemService.deleteItem(itemId);
                showNotification("Item deleted successfully", "success");
                fetchItems();
            } catch (err) {
                showNotification("Failed to delete item", "error");
            }
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, marginBottom: '4px' }}>
                        Menu Items
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        {items.length} item{items.length !== 1 ? 's' : ''} in your menu
                    </p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                    <Plus size={20} /> Add Item
                </button>
            </div>

            {/* Items Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`scale-in stagger-${(index % 4) + 1}`}
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            transition: 'var(--transition)',
                            position: 'relative'
                        }}
                    >
                        {/* Image/Placeholder */}
                        <div style={{
                            height: '160px',
                            background: 'var(--bg-gray)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {getItemImage(item) ? (
                                <img
                                    src={getItemImage(item)}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div style={{
                                display: getItemImage(item) ? 'none' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%'
                            }}>
                                <Package size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                            </div>
                            {/* Availability Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-xl)',
                                background: item.available ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {item.available ? 'Available' : 'Unavailable'}
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    color: 'var(--text-main)',
                                    margin: 0
                                }}>
                                    {item.name}
                                </h4>
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    color: 'var(--primary)'
                                }}>
                                    ₹{item.price.toFixed(2)}
                                </span>
                            </div>

                            {item.category && (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 10px',
                                    background: 'var(--bg-gray)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    <Tag size={12} /> {item.category}
                                </div>
                            )}

                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem',
                                margin: 0,
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '40px'
                            }}>
                                {item.description || 'No description available.'}
                            </p>

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '10px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        color: '#EF4444',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Item Card */}
                <div
                    onClick={() => handleOpenModal()}
                    style={{
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 20px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        background: 'transparent',
                        minHeight: '280px'
                    }}
                >
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        marginBottom: '12px'
                    }}>
                        <Plus size={28} />
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Add New Item</span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="scale-in" style={{
                        background: 'var(--card-bg)',
                        borderRadius: 'var(--radius-xl)',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: 'var(--shadow-xl)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '24px',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                                {editingItem ? 'Edit Item' : 'Add New Item'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    background: 'var(--bg-gray)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            {/* Name */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Margherita Pizza"
                                    required
                                />
                            </div>

                            {/* Image URL */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                    Image URL
                                </label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="input"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            Provide a direct link to an image. Leave empty for automatic category image.
                                        </p>
                                    </div>
                                    {formData.imageUrl && (
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            border: '1px solid var(--border)',
                                            flexShrink: 0
                                        }}>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=Error'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price & Category */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input"
                                        placeholder="199.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input"
                                        placeholder="e.g., Pizza"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    placeholder="Describe your item..."
                                    style={{ height: '100px', resize: 'vertical' }}
                                />
                            </div>

                            {/* Nutritional Info Section */}
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag size={16} /> Nutritional Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Calories (kcal)</label>
                                        <input
                                            type="number"
                                            value={formData.calories}
                                            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                            className="input"
                                            placeholder="450"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Protein (g)</label>
                                        <input
                                            type="number"
                                            value={formData.protein}
                                            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                                            className="input"
                                            placeholder="20"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Fat (g)</label>
                                        <input
                                            type="number"
                                            value={formData.fat}
                                            onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                                            className="input"
                                            placeholder="15"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Carbs (g)</label>
                                        <input
                                            type="number"
                                            value={formData.carbs}
                                            onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                                            className="input"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    padding: '16px',
                                    background: formData.available ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-gray)',
                                    borderRadius: 'var(--radius-md)',
                                    border: formData.available ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                                    transition: 'var(--transition)'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: formData.available ? 'none' : '2px solid var(--border)',
                                        background: formData.available ? '#10B981' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'var(--transition)'
                                    }}>
                                        {formData.available && <Check size={16} color="white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.available}
                                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                        style={{ display: 'none' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>Available for order</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customers can see and order this item</div>
                                    </div>
                                </label>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                {editingItem ? 'Update Item' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemManager;
