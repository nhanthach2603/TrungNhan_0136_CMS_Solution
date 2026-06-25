using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Services
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = "";
        public int SmtpPort { get; set; } = 587;
        public string SmtpUser { get; set; } = "";
        public string SmtpPass { get; set; } = "";
        public string FromEmail { get; set; } = "";
        public string FromName { get; set; } = "Camera24h.Shop";
    }

    public class EmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _settings = config.GetSection("EmailSettings").Get<EmailSettings>() ?? new EmailSettings();
            _logger = logger;
        }

        public async Task SendOrderConfirmationAsync(
            string toEmail,
            string customerName,
            int orderId,
            DateTime orderDate,
            List<OrderEmailItem> items,
            decimal totalAmount,
            string? notes)
        {
            if (string.IsNullOrEmpty(_settings.SmtpServer))
            {
                _logger.LogWarning("EmailSettings not configured. Skipping email.");
                return;
            }

            var subject = $"[Camera24h.Shop] Xác nhận đơn hàng #{orderId}";

            var itemsHtml = "";
            int stt = 1;
            foreach (var item in items)
            {
                itemsHtml += $@"
                <tr>
                    <td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;'>{stt}</td>
                    <td style='padding:8px;border-bottom:1px solid #e2e8f0;'>{item.ProductName}</td>
                    <td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;'>{item.UnitPrice:N0} ₫</td>
                    <td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;'>{item.Quantity}</td>
                    <td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;'>{item.SubTotal:N0} ₫</td>
                </tr>";
                stt++;
            }

            var body = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family:""Segoe UI"",sans-serif;background:#f1f5f9;margin:0;padding:20px;'>
<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);'>

    <!-- Header -->
    <div style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:24px 30px;text-align:center;'>
        <h1 style='color:#d97706;margin:0;font-size:22px;'>CAMERA24H.SHOP</h1>
        <p style='color:#94a3b8;margin:6px 0 0;font-size:13px;'>Xác nhận đơn hàng thành công</p>
    </div>

    <!-- Content -->
    <div style='padding:30px;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <div style='display:inline-block;background:#22c55e;color:#fff;border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;'>✓</div>
            <h2 style='color:#1e293b;margin:12px 0 4px;'>Đặt hàng thành công!</h2>
            <p style='color:#64748b;margin:0;'>Cảm ơn bạn đã mua sắm tại Camera24h.Shop</p>
        </div>

        <!-- Order Info -->
        <div style='background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:20px;'>
            <table style='width:100%;font-size:14px;'>
                <tr>
                    <td style='color:#64748b;padding:4px 0;'>Mã đơn hàng:</td>
                    <td style='font-weight:bold;color:#0f172a;text-align:right;'>#{orderId}</td>
                </tr>
                <tr>
                    <td style='color:#64748b;padding:4px 0;'>Khách hàng:</td>
                    <td style='color:#0f172a;text-align:right;'>{customerName}</td>
                </tr>
                <tr>
                    <td style='color:#64748b;padding:4px 0;'>Ngày đặt:</td>
                    <td style='color:#0f172a;text-align:right;'>{orderDate:dd/MM/yyyy HH:mm}</td>
                </tr>
                <tr>
                    <td style='color:#64748b;padding:4px 0;'>Trạng thái:</td>
                    <td style='text-align:right;'><span style='background:#fbbf24;color:#78350f;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:bold;'>Chờ duyệt</span></td>
                </tr>
            </table>
        </div>

        <!-- Products Table -->
        <h3 style='color:#0f172a;font-size:15px;margin-bottom:10px;'>Chi tiết sản phẩm:</h3>
        <table style='width:100%;border-collapse:collapse;font-size:13px;'>
            <thead>
                <tr style='background:#0f172a;color:#fff;'>
                    <th style='padding:10px 8px;text-align:center;border-radius:8px 0 0 0;'>STT</th>
                    <th style='padding:10px 8px;text-align:left;'>Sản phẩm</th>
                    <th style='padding:10px 8px;text-align:right;'>Đơn giá</th>
                    <th style='padding:10px 8px;text-align:center;'>SL</th>
                    <th style='padding:10px 8px;text-align:right;border-radius:0 8px 0 0;'>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {itemsHtml}
            </tbody>
        </table>

        <!-- Total -->
        <div style='text-align:right;margin-top:16px;padding:16px 20px;background:#fffbeb;border-radius:8px;border:2px solid #d97706;'>
            <span style='font-size:16px;color:#64748b;'>Tổng cộng: </span>
            <span style='font-size:22px;font-weight:bold;color:#dc2626;'>{totalAmount:N0} ₫</span>
        </div>

        {(string.IsNullOrEmpty(notes) ? "" : $@"
        <div style='margin-top:16px;padding:12px 16px;background:#f0f9ff;border-left:4px solid #3b82f6;border-radius:4px;'>
            <strong style='color:#1e40af;'>Ghi chú:</strong> <span style='color:#334155;'>{notes}</span>
        </div>
        ")}

        <!-- Footer -->
        <div style='margin-top:30px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;'>
            <p style='margin:4px 0;'>Nếu bạn có thắc mắc, vui lòng liên hệ: <a href='mailto:support@camera24h.shop' style='color:#d97706;'>support@camera24h.shop</a></p>
            <p style='margin:4px 0;'>Hotline: 1800 2424 (Miễn phí)</p>
            <p style='margin:8px 0 0;color:#cbd5e1;'>© 2026 Camera24h.Shop</p>
        </div>
    </div>
</div>
</body>
</html>";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                using var message = new MailMessage();
                message.From = new MailAddress(_settings.FromEmail, _settings.FromName);
                message.To.Add(toEmail);
                message.Subject = subject;
                message.Body = htmlBody;
                message.IsBodyHtml = true;

                using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_settings.SmtpUser, _settings.SmtpPass),
                    EnableSsl = true,
                    Timeout = 15000
                };

                await client.SendMailAsync(message);
                _logger.LogInformation("Email sent to {Email} for order confirmation.", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}.", toEmail);
            }
        }
    }

    public class OrderEmailItem
    {
        public string ProductName { get; set; } = "";
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal SubTotal => UnitPrice * Quantity;
    }
}
