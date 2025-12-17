INSERT INTO [MyStore].[dbo].[product_reviews]
    ([comment], [created_at], [product_id], [rating], [user_id])
VALUES
(N'Sản phẩm rất tốt, giao hàng nhanh.', GETDATE(), 1, 5, 1),
(N'Chất lượng ổn so với giá.', GETDATE(), 1, 4, 1),
(N'Không giống ảnh lắm nhưng xài được.', GETDATE(), 1, 3, 1),
(N'Đóng gói sơ sài, nhưng sản phẩm ok.', GETDATE(), 1, 4, 1),
(N'Mua lần thứ hai rồi, rất hài lòng.', GETDATE(), 1, 5, 1),
(N'Giao thiếu phụ kiện.', GETDATE(), 1, 2, 1),
(N'Mùi hơi khó chịu, nhưng dùng ổn.', GETDATE(), 1, 3, 1),
(N'Shop hỗ trợ rất nhiệt tình.', GETDATE(), 1, 5, 1),
(N'Không đáng tiền.', GETDATE(), 1, 1, 1),
(N'Rất đáng mua, sẽ ủng hộ tiếp.', GETDATE(), 1, 5, 1);
