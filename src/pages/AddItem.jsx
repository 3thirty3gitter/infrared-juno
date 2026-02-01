import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Camera, Save, ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const AddItem = () => {
    const { id: tubId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const addTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('item-images') // Bucket name
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('item-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (uploadErr) {
                    console.warn("Image upload failed (Bucket might not exist):", uploadErr);
                    // Fallback: We proceed without image or use a placeholder if upload fails 
                    // because the user hasn't created the bucket yet.
                    alert("Note: Image upload failed. Proceeding with text only. Check Supabase Storage settings.");
                }
            }

            const { error } = await supabase.from('items').insert([
                {
                    tub_id: tubId,
                    user_id: user.id,
                    name,
                    description,
                    image_url: imageUrl,
                    expiry_date: expiryDate || null,
                    tags: tags
                }
            ]);

            if (error) throw error;
            navigate(`/tubs/${tubId}`);

        } catch (err) {
            console.error(err);
            alert('Error saving item: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <h1>Add Item</h1>

            <form onSubmit={handleSubmit}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    {previewUrl ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={previewUrl} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', border: '1px solid var(--glass-border)' }} alt="Preview" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '8px', borderRadius: '50%' }}
                            >
                                <Camera size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="btn"
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-accent)', flexDirection: 'column', gap: '8px', padding: '24px', width: '100%', border: '2px dashed var(--glass-border)' }}
                        >
                            <Camera size={48} />
                            <span>Take Photo</span>
                        </button>
                    )}
                </div>

                <div className="glass-card">
                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Item Name</label>
                    <input
                        type="text"
                        placeholder="What is it?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Description</label>
                    <textarea
                        placeholder="Details, quantity, condition..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '12px', display: 'block' }}>Expiry / Reminder Date</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '12px', display: 'block' }}>Tags</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            placeholder="Add tag (e.g. Fragile)..."
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                        />
                        <button type="button" onClick={addTag} className="btn" style={{ background: 'var(--color-primary)', height: '44px', width: '44px', padding: 0 }}>
                            +
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tags.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.2em', lineHeight: 1 }}>&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                    disabled={loading}
                >
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Item'}
                </button>
            </form>
        </div>
    );
};

export default AddItem;
