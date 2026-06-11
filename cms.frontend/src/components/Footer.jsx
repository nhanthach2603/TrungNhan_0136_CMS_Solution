import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-title">ThaiCMS.Fashion</div>
                        <p className="footer-desc">
                            Thời trang công sở & dạ hội dành cho phái đẹp.
                            Chất lượng cao, giá cả hợp lý, giao hàng toàn quốc.
                        </p>
                        <div className="footer-social">
                            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                    <div>
                        <div className="footer-title">Chính sách</div>
                        <ul className="footer-links">
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Chính sách vận chuyển</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Điều khoản sử dụng</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-title">Liên hệ</div>
                        <ul className="footer-links">
                            <li><i className="fa-solid fa-location-dot mr-2"></i> 123 Đường Thời Trang, Q.1, TP.HCM</li>
                            <li><i className="fa-solid fa-phone mr-2"></i> 1900 6789</li>
                            <li><i className="fa-solid fa-envelope mr-2"></i> support@thaicms.vn</li>
                            <li><i className="fa-solid fa-clock mr-2"></i> T2 - T7: 8:00 - 21:00</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; 2026 ThaiCMS.Fashion — Học Phần Chuyên Đề ASP.NET + ReactJS
                </div>
            </div>
        </footer>
    );
};

export default Footer;
