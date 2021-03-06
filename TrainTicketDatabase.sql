USE [master]
GO
/****** Object:  Database [TrainTicketDatabase]    Script Date: 5/23/2020 8:52:38 PM ******/
CREATE DATABASE [TrainTicketDatabase]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'TrainTicketDatabase', FILENAME = N'C:\SQL_Database\TrainTicketDatabase.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'TrainTicketDatabase_log', FILENAME = N'C:\SQL_Database\TrainTicketDatabase_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
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
ALTER DATABASE [TrainTicketDatabase] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [TrainTicketDatabase] SET QUERY_STORE = OFF
GO
USE [TrainTicketDatabase]
GO
/****** Object:  Table [dbo].[Carriage]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[Customer]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[Representative]    Script Date: 5/23/2020 8:52:38 PM ******/
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
	[Name] [nvarchar](max) NULL,
	[DateBooking] [date] NULL,
 CONSTRAINT [PK_Representative] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedule]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[ScheduleDetail]    Script Date: 5/23/2020 8:52:38 PM ******/
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
	[Time] [float] NULL,
	[StartTime] [time](7) NULL,
 CONSTRAINT [PK_ScheduleDetail] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Seat]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[SeatType]    Script Date: 5/23/2020 8:52:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SeatType](
	[ID] [int] NOT NULL,
	[TypeName] [nvarchar](50) NULL,
	[CostPerKm] [int] NULL,
 CONSTRAINT [PK_SeatType] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Station]    Script Date: 5/23/2020 8:52:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Station](
	[ID] [int] NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Location] [nvarchar](max) NULL,
	[Distance] [int] NULL,
 CONSTRAINT [PK_Station] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TableCost]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[Ticket]    Script Date: 5/23/2020 8:52:38 PM ******/
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
	[DepartureStationID] [int] NULL,
	[ArrivalStationID] [int] NULL,
 CONSTRAINT [PK_Ticket] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Train]    Script Date: 5/23/2020 8:52:38 PM ******/
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
/****** Object:  Table [dbo].[TypeObject]    Script Date: 5/23/2020 8:52:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeObject](
	[ID] [int] NOT NULL,
	[TypeObjectName] [nvarchar](50) NULL,
	[Discount] [nchar](10) NULL,
 CONSTRAINT [PK_TypeObject] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (1, N'Toa01', 1)
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (2, N'Toa02', 1)
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (3, N'Toa03', 1)
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (4, N'Toa01', 2)
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (5, N'Toa04', 1)
INSERT [dbo].[Carriage] ([ID], [Name], [TrainID]) VALUES (6, N'Toa01', 3)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1, N'Tai', N'123456789', 1, 1)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11111, N'First Name Test Last Name Test', N'123456789', 4, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1000011, N'First Name Test Last Name Test', N'123456789', 207, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1101001, N'First Name Test Last Name Test', N'123456789', 141, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1110010, N'First Name Test Last Name Test', N'123456789', 174, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1111010, N'First Name Test Last Name Test', N'123456789', 51, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (1629255, N'First Name Test Last Name Test', N'123456789', 17971527, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (3146989, N'First Name Test Last Name Test', N'123456789', 15599614, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (3356226, N'First Name Test Last Name Test', N'123456789', 13657327, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (5480021, N'First Name Test Last Name Test', N'123456789', 14044758, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (5746202, N'First Name Test Last Name Test', N'123456789', 16768988, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (8099887, N'First Name Test Last Name Test', N'123456789', 13657327, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (8279221, N'First Name Test Last Name Test', N'123456789', 13657327, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (9997155, N'First Name Test Last Name Test', N'123456789', 13657327, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (10001110, N'First Name Test Last Name Test', N'123456789', 1001001, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (10100010, N'First Name Test Last Name Test', N'123456789', 114, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (10101101, N'First Name Test Last Name Test', N'123456789', 239, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11000111, N'First Name Test Last Name Test', N'123456789', 135, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11001100, N'First Name Test Last Name Test', N'123456789', 166, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11100100, N'First Name Test Last Name Test', N'123456789', 144, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11359414, N'First Name Test Last Name Test', N'123456789', 10056699, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (11936977, N'First Name Test Last Name Test', N'123456789', 10582254, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (14168664, N'First Name Test Last Name Test', N'123456789', 14915198, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (15146620, N'First Name Test Last Name Test', N'123456789', 13657327, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (15464632, N'First Name Test Last Name Test', N'123456789', 3415357, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (15850570, N'First Name Test Last Name Test', N'123456789', 8708467, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (16057357, N'First Name Test Last Name Test', N'123456789', 14818551, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (16397356, N'First Name Test Last Name Test', N'123456789', 15059831, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (17076758, N'First Name Test Last Name Test', N'123456789', 14156558, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (18416389, N'First Name Test Last Name Test', N'123456789', 18477255, 2)
INSERT [dbo].[Customer] ([ID], [Name], [Passport], [RepresentativeID], [TypeObjectID]) VALUES (98498910, N'First Name Test Last Name Test', N'123456789', 82503559, 2)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (1, N'phantuantai1234@gmail.com', N'123456789', N'123456789', 300000, NULL, NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (4, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (51, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (114, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (134, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (135, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (141, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (144, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (166, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (174, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (207, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (239, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (1001001, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (1111010, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (3415357, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (8708467, N'emailtest@gmail.com', N'3664338283', N'123456789', 300000, N'Full Name Test', CAST(N'2020-05-18' AS Date))
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (10056699, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', CAST(N'2020-05-16' AS Date))
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (10582254, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (13657327, N'emailtest@gmail.com', N'3664338283', N'123456789', 1500000, N'Full Name Test', CAST(N'2020-05-21' AS Date))
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (14044758, N'emailtest@gmail.com', N'3664338283', N'123456789', 300000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (14156558, N'emailtest@gmail.com', N'3664338283', N'123456789', 300000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (14818551, N'emailtest@gmail.com', N'3664338283', N'123456789', 300000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (14915198, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', CAST(N'2020-05-20' AS Date))
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (15059831, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', CAST(N'2020-05-11' AS Date))
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (15599614, N'emailtest@gmail.com', N'3664338283', N'123456789', 300000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (16768988, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (17971527, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (18477255, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Representative] ([ID], [Email], [Phone], [Passport], [TotalCost], [Name], [DateBooking]) VALUES (82503559, N'emailtest@gmail.com', N'3664338283', N'123456789', 150000, N'Full Name Test', NULL)
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (1, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'14:00:00' AS Time), 1)
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (2, CAST(N'2020-05-15T00:00:00.000' AS DateTime), CAST(N'16:00:00' AS Time), 2)
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (3, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'17:00:00' AS Time), 2)
INSERT [dbo].[Schedule] ([ID], [DateDeparture], [TimeDeparture], [TrainID]) VALUES (4, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'20:00:00' AS Time), 3)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (1, 1, 1, 53, 1726, 28.77, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (2, 1, 1, 2, 18, 0.3, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (3, 2, 2, 1, 18, 0.3, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (4, 1, 2, 7, 90, 1.5, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (5, 1, 1, 9, 142, 2.36, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (6, 3, 1, 2, 18, 0.3, NULL)
INSERT [dbo].[ScheduleDetail] ([ID], [ScheduleID], [DepartureStationID], [ArrivalStationID], [Length], [Time], [StartTime]) VALUES (7, 4, 1, 2, 18, 0.3, NULL)
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
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (57, 2, 1, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (58, 2, 1, 2)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (59, 2, 1, 3)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (60, 2, 1, 4)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (61, 2, 1, 5)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (62, 2, 1, 6)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (63, 2, 1, 7)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (64, 2, 1, 8)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (65, 2, 1, 9)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (66, 2, 1, 10)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (67, 2, 1, 11)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (68, 2, 1, 12)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (69, 2, 1, 13)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (70, 2, 1, 14)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (71, 2, 1, 15)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (72, 2, 1, 16)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (73, 2, 1, 17)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (74, 2, 1, 18)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (75, 2, 1, 19)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (76, 2, 1, 20)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (77, 2, 1, 21)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (78, 2, 1, 22)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (79, 2, 1, 23)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (80, 2, 1, 24)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (81, 2, 1, 25)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (82, 2, 1, 26)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (83, 2, 1, 27)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (84, 2, 1, 28)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (85, 2, 1, 29)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (86, 2, 1, 30)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (87, 2, 1, 31)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (88, 2, 1, 32)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (89, 2, 1, 33)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (90, 2, 1, 34)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (91, 2, 1, 35)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (92, 2, 1, 36)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (93, 2, 1, 37)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (94, 2, 1, 38)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (95, 2, 1, 39)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (96, 2, 1, 40)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (97, 2, 1, 41)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (98, 2, 1, 42)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (99, 2, 1, 43)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (100, 2, 1, 44)
GO
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (101, 2, 1, 45)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (102, 2, 1, 46)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (103, 2, 1, 47)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (104, 2, 1, 48)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (105, 2, 1, 49)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (106, 2, 1, 50)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (107, 2, 1, 51)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (108, 2, 1, 52)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (109, 2, 1, 53)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (110, 2, 1, 54)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (111, 2, 1, 55)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (112, 2, 1, 56)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (113, 3, 2, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (114, 3, 2, 2)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (115, 3, 2, 3)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (116, 3, 2, 4)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (117, 3, 2, 5)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (118, 3, 2, 6)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (119, 3, 2, 7)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (120, 3, 2, 8)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (121, 3, 2, 9)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (122, 3, 2, 10)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (123, 3, 2, 11)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (124, 3, 2, 12)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (125, 3, 2, 13)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (126, 3, 2, 14)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (127, 3, 2, 15)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (128, 3, 2, 16)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (129, 3, 2, 17)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (130, 3, 2, 18)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (131, 3, 2, 19)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (132, 3, 2, 20)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (133, 3, 2, 21)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (134, 3, 2, 22)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (135, 3, 2, 23)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (136, 3, 2, 24)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (137, 3, 2, 25)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (138, 3, 2, 26)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (139, 3, 2, 27)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (140, 3, 2, 28)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (141, 3, 2, 29)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (142, 3, 2, 30)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (143, 3, 2, 31)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (144, 3, 2, 32)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (145, 3, 2, 33)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (146, 3, 2, 34)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (147, 3, 2, 35)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (148, 3, 2, 36)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (149, 3, 2, 37)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (150, 3, 2, 38)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (151, 3, 2, 39)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (152, 3, 2, 40)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (153, 3, 2, 41)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (154, 3, 2, 42)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (155, 3, 2, 43)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (156, 3, 2, 44)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (157, 3, 2, 45)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (158, 3, 2, 46)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (159, 3, 2, 47)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (160, 3, 2, 48)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (161, 3, 2, 49)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (162, 3, 2, 50)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (163, 3, 2, 51)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (164, 3, 2, 52)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (165, 3, 2, 53)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (166, 3, 2, 54)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (167, 3, 2, 55)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (168, 3, 2, 56)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (169, 4, 1, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (170, 4, 1, 2)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (171, 4, 1, 3)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (172, 4, 1, 4)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (173, 4, 1, 5)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (174, 4, 1, 6)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (175, 4, 1, 7)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (176, 4, 1, 8)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (177, 4, 1, 9)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (178, 4, 1, 10)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (179, 4, 1, 11)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (180, 4, 1, 12)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (181, 4, 1, 13)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (182, 4, 1, 14)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (183, 4, 1, 15)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (184, 4, 1, 16)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (185, 4, 1, 17)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (186, 4, 1, 18)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (187, 4, 1, 19)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (188, 4, 1, 20)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (189, 4, 1, 21)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (190, 4, 1, 22)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (191, 4, 1, 23)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (192, 4, 1, 24)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (193, 4, 1, 25)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (194, 4, 1, 26)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (195, 4, 1, 27)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (196, 4, 1, 28)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (197, 4, 1, 29)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (198, 4, 1, 30)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (199, 4, 1, 31)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (200, 4, 1, 32)
GO
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (201, 4, 1, 33)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (202, 4, 1, 34)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (203, 4, 1, 35)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (204, 4, 1, 36)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (205, 4, 1, 37)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (206, 4, 1, 38)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (207, 4, 1, 39)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (208, 4, 1, 40)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (209, 4, 1, 41)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (210, 4, 1, 42)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (211, 4, 1, 43)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (212, 4, 1, 44)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (213, 4, 1, 45)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (214, 4, 1, 46)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (215, 4, 1, 47)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (216, 4, 1, 48)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (217, 4, 1, 49)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (218, 4, 1, 50)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (219, 4, 1, 51)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (220, 4, 1, 52)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (221, 4, 1, 53)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (222, 4, 1, 54)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (223, 4, 1, 55)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (224, 4, 1, 56)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (225, 5, 6, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (227, 5, 6, 2)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (228, 5, 6, 3)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (229, 5, 6, 4)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (230, 5, 6, 5)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (231, 5, 6, 6)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (232, 5, 6, 7)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (233, 5, 6, 8)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (234, 5, 6, 9)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (235, 5, 6, 10)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (236, 5, 6, 11)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (237, 5, 6, 12)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (238, 5, 6, 13)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (239, 5, 6, 14)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (240, 5, 6, 15)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (241, 5, 6, 16)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (242, 5, 6, 17)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (243, 5, 6, 18)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (244, 5, 6, 19)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (245, 5, 6, 20)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (246, 5, 6, 21)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (247, 5, 6, 22)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (248, 5, 6, 23)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (249, 5, 6, 24)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (250, 5, 6, 25)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (251, 5, 6, 26)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (252, 5, 6, 27)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (253, 5, 6, 28)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (254, 5, 6, 29)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (255, 5, 6, 30)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (256, 5, 6, 31)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (257, 5, 6, 32)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (258, 5, 6, 33)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (259, 5, 6, 34)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (260, 5, 6, 35)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (261, 5, 6, 36)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (262, 5, 6, 37)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (263, 5, 6, 38)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (264, 5, 6, 39)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (265, 5, 6, 40)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (266, 5, 6, 41)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (267, 5, 6, 42)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (300, 6, 1, 1)
INSERT [dbo].[Seat] ([ID], [CarriageID], [SeatTypeID], [SeatNumber]) VALUES (301, 4, 2, 1)
INSERT [dbo].[SeatType] ([ID], [TypeName], [CostPerKm]) VALUES (1, N'Nằm Khoang 4', 850)
INSERT [dbo].[SeatType] ([ID], [TypeName], [CostPerKm]) VALUES (2, N'Ghế Mềm', 600)
INSERT [dbo].[SeatType] ([ID], [TypeName], [CostPerKm]) VALUES (3, N'Ghế Cứng', 500)
INSERT [dbo].[SeatType] ([ID], [TypeName], [CostPerKm]) VALUES (6, N'Nằm Khoang 6', 750)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (1, N'Hà Nội', NULL, 0)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (2, N'Thường Tín', NULL, 18)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (3, N'Phú Xuyên', NULL, 34)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (4, N'Phủ Lý', NULL, 56)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (5, N'Đặng Xá', NULL, 81)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (6, N'Nam Định', NULL, 87)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (7, N'Cát Đằng', NULL, 108)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (8, N'Cầu Yên', NULL, 121)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (9, N'Bỉm Sơn', NULL, 142)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (10, N'Nghĩa Trang', NULL, 161)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (11, N'Thanh Hóa', NULL, 176)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (12, N'Minh Khôi', NULL, 197)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (13, N'Khoa Trường', NULL, 229)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (14, N'Hoàng Mai', NULL, 245)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (15, N'Yên Lý', NULL, 272)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (16, N'Chợ Sy', NULL, 279)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (17, N'Vinh', NULL, 319)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (18, N'Đức Lạc', NULL, 345)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (19, N'Thanh Luyện', NULL, 370)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (20, N'La Khê', NULL, 405)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (21, N'Ngọc Lâm', NULL, 450)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (22, N'Lệ Sơn', NULL, 468)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (23, N'Đồng Hới', NULL, 522)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (24, N'Thượng Lâm', NULL, 572)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (25, N'Đông Hà', NULL, 622)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (26, N'Phò Trạch', NULL, 660)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (27, N'Huế', NULL, 688)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (28, N'Lăng Cô', NULL, 755)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (29, N'Hải Vân Nam', NULL, 772)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (30, N'Đà Nẵng', NULL, 791)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (31, N'Tam Kỳ', NULL, 865)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (32, N'Đại Lộc', NULL, 920)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (33, N'Thủy Trạch', NULL, 977)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (34, N'Vạn Phú', NULL, 1033)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (35, N'Diệu Trì', NULL, 1096)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (36, N'Chí Thạnh', NULL, 1171)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (37, N'Hảo Sơn', NULL, 1221)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (38, N'Ninh Hòa', NULL, 1281)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (39, N'Nha Trang', NULL, 1315)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (40, N'Kà Rôm', NULL, 1381)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (41, N'Cà Ná', NULL, 1436)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (42, N'Châu Hanh', NULL, 1493)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (43, N'Ma Lâm', NULL, 1533)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (44, N'Bình Thuận', NULL, 1551)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (45, N'Sông Phan', NULL, 1582)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (46, N'Gia Ray', NULL, 1631)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (47, N'Trảng Bom', NULL, 1677)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (48, N'	Biên Hòa', NULL, 1697)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (49, N'Dĩ An', NULL, 1707)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (50, N'Sóng Thần', NULL, 1711)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (51, N'Bình Triệu', NULL, 1718)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (52, N'Gò Vấp', NULL, 1722)
INSERT [dbo].[Station] ([ID], [Name], [Location], [Distance]) VALUES (53, N'Sài Gòn', NULL, 1726)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (1, 1, 800000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (1, 2, 1000000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (1, 6, 1200000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 1, 150000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 2, 300000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (2, 6, 300000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (3, 1, 150000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (4, 1, 100000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (4, 2, 200000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (5, 1, 300000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (5, 2, 450000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (5, 3, 550000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (6, 1, 100000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (6, 2, 100000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (7, 1, 150000)
INSERT [dbo].[TableCost] ([ScheduleID], [SeatTypeID], [Cost]) VALUES (7, 2, 200000)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (2, 1, 1, 1, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'2020-05-13T14:00:00.000' AS DateTime), 1, N'SE3', 1, 9)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (3, 1, 2, 1, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'2020-05-13T14:00:00.000' AS DateTime), 1, N'SE3', 1, 53)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (100100, 10100010, 2, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (111111, 98498910, 22, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (643461, 17076758, 195, 150000, CAST(N'2020-05-15T00:00:00.000' AS DateTime), CAST(N'1970-01-01T16:00:00.000' AS DateTime), 1, N'SE2', 2, 1)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1001000, 1000011, 5, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1001011, 11111, 6, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1001100, 11100100, 18, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1011001, 11000111, 17, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1101111, 1101001, 13, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1418608, 3146989, 194, 150000, CAST(N'2020-05-15T00:00:00.000' AS DateTime), CAST(N'1970-01-01T16:00:00.000' AS DateTime), 1, N'SE2', 2, 1)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (1941287, 3356226, 250, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (2091138, 16057357, 28, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (2428343, 8279221, 254, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (2559928, 11359414, 16, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 3, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (3074470, 16057357, 196, 150000, CAST(N'2020-05-15T00:00:00.000' AS DateTime), CAST(N'1970-01-01T16:00:00.000' AS DateTime), 1, N'SE2', 2, 1)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (3683809, 15464632, 24, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (4384545, 15850570, 117, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (6503560, 16397356, 19, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (8567936, 5480021, 169, 150000, CAST(N'2020-05-15T00:00:00.000' AS DateTime), CAST(N'1970-01-01T16:00:00.000' AS DateTime), 1, N'SE2', 2, 1)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (9287054, 5746202, 23, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (10000000, 1110010, 10, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (10111001, 11001100, 9, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (11010111, 10001110, 21, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (11011000, 1111010, 1, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (11017688, 3146989, 26, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (11101111, 10101101, 14, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (13058318, 11936977, 20, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (14987890, 9997155, 252, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (16299727, 1629255, 25, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (17344833, 17076758, 27, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (17385823, 15146620, 253, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (17848076, 14168664, 15, 150000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Ticket] ([ID], [CustomerID], [SeatID], [Price], [DepartureDate], [DepartureTime], [Status], [TrainName], [DepartureStationID], [ArrivalStationID]) VALUES (18045324, 8099887, 251, 300000, CAST(N'2020-05-10T00:00:00.000' AS DateTime), CAST(N'1970-01-01T14:00:00.000' AS DateTime), 1, N'SE3', 1, 2)
INSERT [dbo].[Train] ([ID], [Name]) VALUES (1, N'SE3')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (2, N'SE2')
INSERT [dbo].[Train] ([ID], [Name]) VALUES (3, N'SE5')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName], [Discount]) VALUES (1, N'Trẻ Em', N'1         ')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName], [Discount]) VALUES (2, N'Người Lớn', N'0         ')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName], [Discount]) VALUES (3, N'Sinh Viên', N'0.3       ')
INSERT [dbo].[TypeObject] ([ID], [TypeObjectName], [Discount]) VALUES (4, N'Học Sinh', N'0.5       ')
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
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD  CONSTRAINT [FK_Ticket_Station] FOREIGN KEY([DepartureStationID])
REFERENCES [dbo].[Station] ([ID])
GO
ALTER TABLE [dbo].[Ticket] CHECK CONSTRAINT [FK_Ticket_Station]
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD  CONSTRAINT [FK_Ticket_Station1] FOREIGN KEY([ArrivalStationID])
REFERENCES [dbo].[Station] ([ID])
GO
ALTER TABLE [dbo].[Ticket] CHECK CONSTRAINT [FK_Ticket_Station1]
GO
USE [master]
GO
ALTER DATABASE [TrainTicketDatabase] SET  READ_WRITE 
GO
