/**
 * Shared formatting utilities — dùng chung cho toàn bộ ứng dụng
 */

/**
 * Định dạng số tiền theo chuẩn tiền Việt Nam (VNĐ)
 * @param {number} price
 * @returns {string}
 */
export const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

/**
 * Định dạng ngày theo chuẩn tiếng Việt (dd/mm/yyyy)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) =>
    new Date(date).toLocaleDateString('vi-VN');
