import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', phone: '', address: ''
    });
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
            await authService.register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow border-0">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <i className="fa-solid fa-user-plus fa-3x text-success"></i>
                            <h3 className="mt-3 font-weight-bold">Đăng ký tài khoản</h3>
                            <p className="text-muted">Tạo tài khoản để mua sắm dễ dàng hơn!</p>
                        </div>

                        {error && <div className="alert alert-danger py-2"><i className="fa-solid fa-circle-exclamation mr-1"></i>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="font-weight-bold"><i className="fa-solid fa-user mr-1"></i>Họ và tên</label>
                                <input name="fullName" value={form.fullName} onChange={handleChange}
                                       className="form-control form-control-lg" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div className="form-group mt-3">
                                <label className="font-weight-bold"><i className="fa-solid fa-envelope mr-1"></i>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                       className="form-control form-control-lg" placeholder="email@example.com" required />
                            </div>
                            <div className="form-group mt-3">
                                <label className="font-weight-bold"><i className="fa-solid fa-lock mr-1"></i>Mật khẩu</label>
                                <input type="password" name="password" value={form.password} onChange={handleChange}
                                       className="form-control form-control-lg" placeholder="Ít nhất 6 ký tự" required />
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="font-weight-bold"><i className="fa-solid fa-phone mr-1"></i>Số điện thoại</label>
                                        <input name="phone" value={form.phone} onChange={handleChange}
                                               className="form-control form-control-lg" placeholder="0901234567" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="font-weight-bold"><i className="fa-solid fa-location-dot mr-1"></i>Địa chỉ</label>
                                        <input name="address" value={form.address} onChange={handleChange}
                                               className="form-control form-control-lg" placeholder="TP. Hồ Chí Minh" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success btn-block btn-lg mt-4" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm mr-2"></span>Đang xử lý...</>
                                ) : (
                                    <><i className="fa-solid fa-user-plus mr-2"></i>Đăng ký</>
                                )}
                            </button>
                        </form>

                        <hr className="my-4" />
                        <p className="text-center mb-0">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="font-weight-bold text-decoration-none">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
