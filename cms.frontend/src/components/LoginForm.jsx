import React, { useState } from 'react';
import authService from '../services/authService';

const LoginForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(form);
            localStorage.setItem('customerId', data.customerId);
            localStorage.setItem('fullName', data.fullName);
            setMessage(`Xin chào ${data.fullName}! Mã KH: ${data.customerId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="fa-solid fa-right-to-bracket mr-2"></i>Đăng nhập</h5>
            </div>
            <div className="card-body">
                {message && <div className="alert alert-success py-2">{message}</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
