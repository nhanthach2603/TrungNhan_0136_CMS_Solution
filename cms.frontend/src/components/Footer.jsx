import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <h3 className="footer-title">ThaiCMS.Fashion</h3>
                        <p>Hệ thống thời trang công sở & dạ hội hàng đầu Việt Nam. Cam kết mang đến sản phẩm chất lượng với mức giá hợp lý nhất cho khách hàng.</p>
                    </div>
                    <div>
                        <h3 className="footer-title">Chính sách</h3>
                        <ul className="footer-links">
                            <li><a href="#"><i className="fa-solid fa-truck mr-1"></i> Chính sách giao hàng</a></li>
                            <li><a href="#"><i className="fa-solid fa-arrow-right-arrow-left mr-1"></i> Chính sách đổi trả 1-1</a></li>
                            <li><a href="#"><i className="fa-solid fa-shield-halved mr-1"></i> Bảo mật thông tin</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="footer-title">Liên hệ</h3>
                        <ul className="footer-contact">
                            <li><i className="fa-solid fa-location-dot"></i> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</li>
                            <li><i className="fa-solid fa-phone"></i> Hotline: 1900 6789</li>
                            <li><i className="fa-solid fa-envelope"></i> support@thaicms.vn</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">© 2026 ThaiCMS Retail. All Rights Reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;
