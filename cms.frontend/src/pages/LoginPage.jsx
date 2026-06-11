import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(form);
            localStorage.setItem('customerId', data.customerId);
            localStorage.setItem('fullName', data.fullName);
            addToast(`Xin chào ${data.fullName}! Đăng nhập thành công.`, 'success');
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <div className="card shadow border-0">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <i className="fa-solid fa-right-to-bracket fa-3x text-primary"></i>
                            <h3 className="mt-3 font-weight-bold">Đăng nhập</h3>
                            <p className="text-muted">Chào mừng bạn quay trở lại!</p>
                        </div>

                        {error && <div className="alert alert-danger py-2"><i className="fa-solid fa-circle-exclamation mr-1"></i>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="font-weight-bold"><i className="fa-solid fa-envelope mr-1"></i>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                       className="form-control form-control-lg" placeholder="Nhập email..." required />
                            </div>
                            <div className="form-group mt-3">
                                <label className="form-label fw-bold"><i className="fa-solid fa-lock mr-1"></i>Mật khẩu</label>
                                <input type="password" name="password" value={form.password} onChange={handleChange}
                                       className="form-control form-control-lg" placeholder="Nhập mật khẩu..." required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm mr-2"></span>Đang xử lý...</>
                                ) : (
                                    <><i className="fa-solid fa-right-to-bracket mr-2"></i>Đăng nhập</>
                                )}
                            </button>
                        </form>

                        <hr className="my-4" />
                        <p className="text-center mb-0">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="font-weight-bold text-decoration-none">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
