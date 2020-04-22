USE [master]
GO
/****** Object:  Database [TrainTicketDatabase]    Script Date: 4/22/2020 4:53:33 PM ******/
CREATE DATABASE [TrainTicketDatabase]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'TrainTicketDatabase', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\TrainTicketDatabase.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'TrainTicketDatabase_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\TrainTicketDatabase_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [TrainTicketDatabase] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [TrainTicketDatabase].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [TrainTicketDatabase] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET ARITHABORT OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [TrainTicketDatabase] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [TrainTicketDatabase] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [TrainTicketDatabase] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET  DISABLE_BROKER 
GO
ALTER DATABASE [TrainTicketDatabase] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [TrainTicketDatabase] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [TrainTicketDatabase] SET  MULTI_USER 
GO
ALTER DATABASE [TrainTicketDatabase] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [TrainTicketDatabase] SET DB_CHAINING OFF 
GO
ALTER DATABASE [TrainTicketDatabase] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [TrainTicketDatabase] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [TrainTicketDatabase]
GO
/****** Object:  Table [dbo].[Carriage]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Customer]    Script Date: 4/22/2020 4:53:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[ID] [int] NOT NULL,
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
/****** Object:  Table [dbo].[Representative]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Schedule]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[ScheduleDetail]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Seat]    Script Date: 4/22/2020 4:53:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Seat](
	[ID] [int] NOT NULL,
	[CarriageID] [int] NULL,
	[SeatTypeID] [int] NULL,
	[SeatNumber] [int] NULL,
 CONSTRAINT [PK_Seat] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[SeatType]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Station]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[TableCost]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Ticket]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[Train]    Script Date: 4/22/2020 4:53:33 PM ******/
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
/****** Object:  Table [dbo].[TypeObject]    Script Date: 4/22/2020 4:53:33 PM ******/
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
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (1, N'Toa01', 1)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1, N'Tai', N'123456789', 1, 1)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost]) VALUES (1, N'phantuantai1234@gmail.com', N'123456789', N'123456789', 300000)
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (1, CAST(N'2020-04-30 00:00:00.000' AS DateTime), CAST(N'08:00:00' AS Time), 1)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time]) VALUES (1, 1, 1, 53, 65, CAST(N'12:00:00' AS Time))
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time]) VALUES (2, 1, 1, 2, 34, CAST(N'06:00:00' AS Time))
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (1, 1, 1, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (2, 1, 1, 2)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (3, 1, 1, 3)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (4, 1, 1, 4)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (5, 1, 1, 5)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (6, 1, 1, 6)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (7, 1, 1, 7)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (8, 1, 1, 8)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (9, 1, 1, 9)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (10, 1, 1, 10)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (11, 1, 1, 11)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (12, 1, 1, 12)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (13, 1, 1, 13)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (14, 1, 1, 14)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (15, 1, 1, 15)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (16, 1, 1, 16)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (17, 1, 1, 17)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (18, 1, 1, 18)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (19, 1, 1, 19)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (20, 1, 1, 20)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (21, 1, 1, 21)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (22, 1, 1, 22)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (23, 1, 1, 23)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (24, 1, 1, 24)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (25, 1, 1, 25)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (26, 1, 1, 26)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (27, 1, 1, 27)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (28, 1, 1, 28)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (29, 1, 1, 29)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (30, 1, 1, 30)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (31, 1, 1, 31)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (32, 1, 1, 32)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (33, 1, 1, 33)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (34, 1, 1, 34)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (35, 1, 1, 35)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (36, 1, 1, 36)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (37, 1, 1, 37)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (38, 1, 1, 38)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (39, 1, 1, 39)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (40, 1, 1, 40)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (41, 1, 1, 41)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (42, 1, 1, 42)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (43, 1, 1, 43)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (44, 1, 1, 44)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (45, 1, 1, 45)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (46, 1, 1, 46)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (47, 1, 1, 47)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (48, 1, 1, 48)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (49, 1, 1, 49)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (50, 1, 1, 50)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (51, 1, 1, 51)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (52, 1, 1, 52)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (53, 1, 1, 53)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (54, 1, 1, 54)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (55, 1, 1, 55)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (56, 1, 1, 56)
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
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 1, 150000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 2, 300000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 3, 350000)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName]) VALUES (1, 1, 1, 300000, CAST(N'2020-04-30 00:00:00.000' AS DateTime), CAST(N'2020-04-14 08:00:00.000' AS DateTime), 1, N'SE04')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (1, N'SE04')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (2, N'SE05')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (3, N'SE06')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName]) VALUES (1, N'Trẻ Em')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName]) VALUES (2, N'Người Lớn')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName]) VALUES (3, N'Sinh Viên')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName]) VALUES (4, N'Học Sinh')
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
USE [master]
GO
ALTER DATABASE [TrainTicketDatabase] SET  READ_WRITE 
GO
