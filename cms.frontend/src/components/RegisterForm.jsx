import React, { useState } from 'react';
import authService from '../services/authService';

const RegisterForm = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
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
            const data = await authService.register(form);
            setMessage(`Đăng ký thành công! Mã KH: ${data.customerId}`);
            setForm({ fullName: '', email: '', password: '', phone: '', address: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0"><i className="fa-solid fa-user-plus mr-2"></i>Đăng ký tài khoản</h5>
            </div>
            <div className="card-body">
                {message && <div className="alert alert-success py-2">{message}</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input name="address" value={form.address} onChange={handleChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-success btn-block" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
