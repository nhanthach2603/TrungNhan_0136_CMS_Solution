import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-title">Camera24h.Shop</div>
                        <p className="footer-desc">
                            Hệ thống bán lẻ máy ảnh, ống kính và thiết bị ngành ảnh chính hãng hàng đầu.
                            Cam kết chất lượng dịch vụ tốt nhất, trả góp 0% lãi suất, giao hàng toàn quốc.
                        </p>
                        <div className="footer-social">
                            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#"><i className="fa-brands fa-youtube"></i></a>
                            <a href="#"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                    <div>
                        <div className="footer-title">Chính sách mua hàng</div>
                        <ul className="footer-links">
                            <li><a href="#">Chính sách đổi trả 7 ngày</a></li>
                            <li><a href="#">Chính sách bảo hành chính hãng</a></li>
                            <li><a href="#">Chính sách giao hàng hỏa tốc</a></li>
                            <li><a href="#">Hướng dẫn mua trả góp 0%</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-title">Liên hệ cửa hàng</div>
                        <ul className="footer-links" style={{ color: '#aaa', fontSize: '0.85rem' }}>
                            <li className="mb-2"><i className="fa-solid fa-location-dot mr-2 text-warning" style={{ marginRight: '8px' }}></i> 456 Đường Máy Ảnh, Quận 1, TP.HCM</li>
                            <li className="mb-2"><i className="fa-solid fa-phone mr-2 text-warning" style={{ marginRight: '8px' }}></i> 1800 2424 (Hotline miễn phí)</li>
                            <li className="mb-2"><i className="fa-solid fa-envelope mr-2 text-warning" style={{ marginRight: '8px' }}></i> support@camera24h.shop</li>
                            <li className="mb-2"><i className="fa-solid fa-clock mr-2 text-warning" style={{ marginRight: '8px' }}></i> Thứ 2 - CN: 8:00 - 21:30</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; 2026 Camera24h.Shop — Học Phần Chuyên Đề ASP.NET + ReactJS
                </div>
            </div>
        </footer>
    );
};

export default Footer;
