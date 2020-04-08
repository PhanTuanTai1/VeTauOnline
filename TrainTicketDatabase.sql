use master
go
create database TrainTicketDatabase
go
USE [TrainTicketDatabase]
GO
/****** Object:  Table [dbo].[Carriage]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Carriage](
	[ID] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[TrainID] [int] NULL,
 CONSTRAINT [PK_Carriage] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[ID] [int] NOT NULL identity,
	[Name] [nvarchar](100) NULL,
	[Passport] [nvarchar](50) NULL,
	[RepresentativeID] [int] NOT NULL,
	[TypeObjectID] [int] NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Representative]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Representative](
	[ID] [int] NOT NULL,
	[Email] [nvarchar](100) NULL,
	[Phone] [nvarchar](50) NULL,
	[Passport] [nvarchar](50) NULL,
	[TotalCost] [float] NULL,
 CONSTRAINT [PK_Representative] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedule]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedule](
	[ID] [int] NOT NULL,
	[DateDeparture] [datetime] NULL,
	[TimeDeparture] [time](7) NULL,
	[TrainID] [int] NULL,
 CONSTRAINT [PK_Schedule] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ScheduleDetail]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ScheduleDetail](
	[ID] [int] NOT NULL,
	[ScheduleID] [int] NULL,
	[DepartureStationID] [int] NULL,
	[ArrivalStationID] [int] NULL,
	[Length] [int] NULL,
	[Time] [time](7) NULL,
 CONSTRAINT [PK_ScheduleDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Seat]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Seat](
	[ID] [int] NOT NULL,
	[CarriageID] [int] NULL,
	[SeatTypeID] [int] NULL,
 CONSTRAINT [PK_Seat] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SeatType]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SeatType](
	[ID] [int] NOT NULL,
	[TypeName] [nvarchar](50) NULL,
 CONSTRAINT [PK_SeatType] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Station]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Station](
	[ID] [int] NOT NULL,
	[Name] [nvarchar](100) NULL,
 CONSTRAINT [PK_Station] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TableCost]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TableCost](
	[ScheduleID] [int] NOT NULL,
	[SeatTypeID] [int] NOT NULL,
	[Cost] [float] NOT NULL,
 CONSTRAINT [PK_TableCost] PRIMARY KEY CLUSTERED 
(
	[ScheduleID] ASC,
	[SeatTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ticket]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ticket](
	[ID] [bigint] NOT NULL,
	[CustomerID] [int] NULL,
	[SeatID] [int] NULL,
	[Price] [float] NULL,
	[DepartureDate] [datetime] NULL,
	[DepartureTime] [datetime] NULL,
	[Status] [smallint] NULL,
	[TrainName] [nvarchar](50) NULL,
 CONSTRAINT [PK_Ticket] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Train]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Train](
	[ID] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Train] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeObject]    Script Date: 2/25/2020 10:44:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeObject](
	[ID] [int] NOT NULL,
	[TypeObjectName] [nvarchar](50) NULL,
 CONSTRAINT [PK_TypeObject] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (1, CAST(N'2018-02-13T00:00:00.000' AS DateTime), CAST(N'08:00:00' AS Time), 1)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time]) VALUES (1, 1, 1, 4, 65, CAST(N'12:00:00' AS Time))
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time]) VALUES (2, 1, 1, 2, 34, CAST(N'06:00:00' AS Time))
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (1, N'Nằm')
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (2, N'Ghế Mềm')
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (3, N'Ghế Cứng')
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (4, N'Ghế Mềm Có Điều Hòa')
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (5, N'Ghế Cứng Có Điều Hòa')
INSERT [dbo].[SeatType] ([ID], [TypeName]) VALUES (6, N'Ghế Phụ')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (1, N'Hà Nội')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (2, N'Thường Tín')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (3, N'Phú Xuyên')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (4, N'Phủ Lý')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (5, N'Đặng Xá')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (6, N'Nam Định')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (7, N'Cát Đằng')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (8, N'Cầu Yên')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (9, N'Bỉm Sơn')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (10, N'Nghĩa Trang')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (11, N'Thanh Hóa')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (12, N'Minh Khôi')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (13, N'Khoa Trường')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (14, N'Hoàng Mai')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (15, N'Yên Lý')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (16, N'Cát Bằng')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (17, N'Vinh')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (18, N'Đức Lạc')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (19, N'Thanh Luyện')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (20, N'La Khê')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (21, N'Bỉm Sơn')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (22, N'Lệ Sơn')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (23, N'Đồng Hới')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (24, N'Thượng Lâm')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (25, N'Đông Hà')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (26, N'Phò Trạch')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (27, N'Huế')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (28, N'Lăng Cô')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (29, N'Hải Vân Nam')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (30, N'Đà Nẵng')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (31, N'Tam Kỳ')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (32, N'Đại Lộc')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (33, N'Thủy Trạch')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (34, N'Vạn Phú')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (35, N'Quy Nhơn')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (36, N'Chí Thạnh')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (37, N'Hảo Sơn')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (38, N'Ninh Hòa')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (39, N'Nha Trang')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (40, N'Kà Rôm')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (41, N'Cà Ná')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (42, N'Châu Hanh')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (43, N'Thanh Luyện')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (44, N'	Phan Thiết')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (45, N'Sông Phan')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (46, N'Gia Ray')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (47, N'Trảng Bom')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (48, N'	Biên Hòa')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (49, N'Dĩ An')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (50, N'Sóng Thần')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (51, N'Bình Triệu')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (52, N'Gò Vấp')
INSERT [dbo].[Station] ([ID], [Name]) VALUES (53, N'Sài Gòn')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (1, N'SE04')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (2, N'SE05')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (3, N'SE06')
ALTER TABLE [dbo].[Carriage]  WITH CHECK ADD  CONSTRAINT [FK_Carriage_Train1] FOREIGN KEY([TrainID])
REFERENCES [dbo].[Train] ([ID])
GO
ALTER TABLE [dbo].[Carriage] CHECK CONSTRAINT [FK_Carriage_Train1]
GO
ALTER TABLE [dbo].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Customer_Representative] FOREIGN KEY([RepresentativeID])
REFERENCES [dbo].[Representative] ([ID])
GO
ALTER TABLE [dbo].[Customer] CHECK CONSTRAINT [FK_Customer_Representative]
GO
ALTER TABLE [dbo].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Customer_TypeObject] FOREIGN KEY([TypeObjectID])
REFERENCES [dbo].[TypeObject] ([ID])
GO
ALTER TABLE [dbo].[Customer] CHECK CONSTRAINT [FK_Customer_TypeObject]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Train] FOREIGN KEY([TrainID])
REFERENCES [dbo].[Train] ([ID])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Train]
GO
ALTER TABLE [dbo].[ScheduleDetail]  WITH CHECK ADD  CONSTRAINT [FK_ScheduleDetail_Schedule] FOREIGN KEY([ScheduleID])
REFERENCES [dbo].[Schedule] ([ID])
GO
ALTER TABLE [dbo].[ScheduleDetail] CHECK CONSTRAINT [FK_ScheduleDetail_Schedule]
GO
ALTER TABLE [dbo].[ScheduleDetail]  WITH CHECK ADD  CONSTRAINT [FK_ScheduleDetail_Station] FOREIGN KEY([DepartureStationID])
REFERENCES [dbo].[Station] ([ID])
GO
ALTER TABLE [dbo].[ScheduleDetail] CHECK CONSTRAINT [FK_ScheduleDetail_Station]
GO
ALTER TABLE [dbo].[ScheduleDetail]  WITH CHECK ADD  CONSTRAINT [FK_ScheduleDetail_Station1] FOREIGN KEY([ArrivalStationID])
REFERENCES [dbo].[Station] ([ID])
GO
ALTER TABLE [dbo].[ScheduleDetail] CHECK CONSTRAINT [FK_ScheduleDetail_Station1]
GO
ALTER TABLE [dbo].[Seat]  WITH CHECK ADD  CONSTRAINT [FK_Seat_Carriage] FOREIGN KEY([CarriageID])
REFERENCES [dbo].[Carriage] ([ID])
GO
ALTER TABLE [dbo].[Seat] CHECK CONSTRAINT [FK_Seat_Carriage]
GO
ALTER TABLE [dbo].[Seat]  WITH CHECK ADD  CONSTRAINT [FK_Seat_SeatType] FOREIGN KEY([SeatTypeID])
REFERENCES [dbo].[SeatType] ([ID])
GO
ALTER TABLE [dbo].[Seat] CHECK CONSTRAINT [FK_Seat_SeatType]
GO
ALTER TABLE [dbo].[TableCost]  WITH CHECK ADD  CONSTRAINT [FK_TableCost_ScheduleDetail] FOREIGN KEY([ScheduleID])
REFERENCES [dbo].[ScheduleDetail] ([ID])
GO
ALTER TABLE [dbo].[TableCost] CHECK CONSTRAINT [FK_TableCost_ScheduleDetail]
GO
ALTER TABLE [dbo].[TableCost]  WITH CHECK ADD  CONSTRAINT [FK_TableCost_SeatType] FOREIGN KEY([SeatTypeID])
REFERENCES [dbo].[SeatType] ([ID])
GO
ALTER TABLE [dbo].[TableCost] CHECK CONSTRAINT [FK_TableCost_SeatType]
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD  CONSTRAINT [FK_Ticket_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([ID])
GO
ALTER TABLE [dbo].[Ticket] CHECK CONSTRAINT [FK_Ticket_Customer]
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD  CONSTRAINT [FK_Ticket_Seat] FOREIGN KEY([SeatID])
REFERENCES [dbo].[Seat] ([ID])
GO
ALTER TABLE [dbo].[Ticket] CHECK CONSTRAINT [FK_Ticket_Seat]
GO
