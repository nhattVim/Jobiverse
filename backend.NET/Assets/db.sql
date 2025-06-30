-- Drop and recreate the database
DROP DATABASE IF EXISTS Jobiverse;
CREATE DATABASE Jobiverse;
USE Jobiverse;

-- Tạo lại bảng Accounts (tương ứng với bảng Users trước đó)
CREATE TABLE Accounts(
    AccountID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    AccountRole ENUM('admin', 'employer', 'student') NOT NULL,
    AuthProvider ENUM('local', 'google', 'facebook') NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Avatar MEDIUMBLOB,
    AvatarType VARCHAR(100),
    PhoneNumber VARCHAR(255),
    Password VARCHAR(255),
    Profile TINYINT(1) DEFAULT 0,
    Deleted TINYINT(1) DEFAULT 0
);

-- Tạo lại bảng Majors
CREATE TABLE Majors(
    MajorID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    Name VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL
);

-- Tạo lại bảng Specialization
CREATE TABLE Specializations(
    SpecializationID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    MajorID VARCHAR(255),
    Name VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    FOREIGN KEY (MajorID) REFERENCES Majors(MajorID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tạo lại bảng Students
CREATE TABLE Students(
    StudentID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    AccountID VARCHAR(255) UNIQUE NOT NULL,
    MSSV VARCHAR(20),
    Name VARCHAR(100) CHARACTER SET utf8mb4,
    MajorID VARCHAR(255),
    SpecializationID VARCHAR(255),
    University VARCHAR(100) CHARACTER SET utf8mb4,
    DefaultCvId VARCHAR(255),
    DefaultCvType ENUM('CV', 'CVUpload'),
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (MajorID) REFERENCES Majors(MajorID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (SpecializationID) REFERENCES Specializations(SpecializationID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE StudentsInterests(
    StudentID VARCHAR(255) NOT NULL,
    Interest VARCHAR(255),
    PRIMARY KEY (StudentID, Interest),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tạo lại bảng Employers
CREATE TABLE Employers(
    EmployerID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    AccountID VARCHAR(255) UNIQUE NOT NULL,
    BusinessScale ENUM('Private individuals', 'Companies') NOT NULL,
    CompanyName VARCHAR(100) CHARACTER SET utf8mb4,
    RepresentativeName VARCHAR(100) CHARACTER SET utf8mb4,
    Position VARCHAR(100) CHARACTER SET utf8mb4,
    Industry VARCHAR(100) CHARACTER SET utf8mb4,
    CompanyInfo VARCHAR(100) CHARACTER SET utf8mb4,
    Prove VARCHAR(100),
    Address VARCHAR(255) CHARACTER SET utf8mb4,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tạo lại bảng Projects
CREATE TABLE Projects (
  ProjectID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  AccountID VARCHAR(255) NOT NULL,
  Title VARCHAR(255) CHARACTER SET utf8mb4,
  Description LONGTEXT,
  Content LONGTEXT,
  WorkingTime VARCHAR(100) CHARACTER SET utf8mb4,
  Status ENUM('open', 'closed', 'in-progress') DEFAULT 'open',
  Salary DECIMAL(10,2),
  ExpRequired INT,
  Deadline DATETIME,
  HiringCount INT DEFAULT 1,
  WorkType ENUM('online', 'offline') DEFAULT 'online',
  CreatedAt DATETIME(3) DEFAULT NOW(3),
  UpdatedAt DATETIME(3) DEFAULT NOW(3) ON UPDATE NOW(3),
  Deleted TINYINT(1) DEFAULT 0,
  FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ProjectLocations (
  ProjectID VARCHAR(255),
  Province VARCHAR(255),
  District VARCHAR(255),
  Ward VARCHAR(255),
  PRIMARY KEY (ProjectID),
  FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
);

CREATE TABLE ProjectMajors (
  ProjectID VARCHAR(255),
  MajorID VARCHAR(255),
  PRIMARY KEY (ProjectID, MajorID),
  FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
);

CREATE TABLE ProjectSpecializations (
  ProjectID VARCHAR(255),
  SpecializationID VARCHAR(255),
  PRIMARY KEY (ProjectID, SpecializationID),
  FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE
);

CREATE TABLE ProjectApplicants (
  ProjectID VARCHAR(255),
  StudentID VARCHAR(255),
  Cv VARCHAR(255),
  CvType VARCHAR(255),
  CoverLetter VARCHAR(255),
  Status ENUM('pending', 'rejected', 'accepted', 'invited', 'declinedInvitation') DEFAULT 'pending',
  AppliedAt DATETIME(3) DEFAULT NOW(3),
  PRIMARY KEY (ProjectID, StudentID),
  FOREIGN KEY (ProjectID)   REFERENCES Projects(ProjectID) ON DELETE CASCADE,
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

CREATE TABLE Favorites(
    AccountID VARCHAR(255) NOT NULL,
    ProjectID VARCHAR(255) NOT NULL,
    CreatedAt DATETIME(3) DEFAULT NOW(3),
    PRIMARY KEY (AccountID, ProjectID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE
);

-- Tạo lại bảng Notifications
CREATE TABLE Notifications(
    NotificationID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    AccountID VARCHAR(255) NOT NULL,
    Content LONGTEXT,
    IsRead TINYINT DEFAULT 0,
    CreatedAt DATETIME(3) DEFAULT NOW(3),
    Deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- Tạo lại bảng CVs
CREATE TABLE CVs (
  CVID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  StudentID VARCHAR(255) NOT NULL,
  Title VARCHAR(255),
  Avatar VARCHAR(255),
  Name VARCHAR(100),
  Birthday DATE,
  Gender VARCHAR(100),
  Phone VARCHAR(20),
  Email VARCHAR(255),
  Address VARCHAR(255),
  Website VARCHAR(255),
  Summary LONGTEXT,
  DesiredPosition VARCHAR(255),
  LastUpdated DATETIME(3) DEFAULT NOW(3),
  Deleted TINYINT(1) DEFAULT 0,
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

CREATE TABLE CV_Experiences (
  ExperienceID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Position VARCHAR(255),
  Company VARCHAR(255),
  StartDate DATE,
  EndDate DATE,
  Description TEXT,
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Educations (
  EducationID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Degree VARCHAR(255),
  School VARCHAR(255),
  StartDate DATE,
  EndDate DATE,
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Activities (
  ActivityID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Title VARCHAR(255),
  Organization VARCHAR(255),
  StartDate DATE,
  EndDate DATE,
  Description TEXT,
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Achievements (
  AchievementID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Title VARCHAR(255),
  Description TEXT,
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Languages (
  LanguageID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Language VARCHAR(100),
  Level VARCHAR(100),
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Socials (
  SocialID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  Platform VARCHAR(100),
  Link VARCHAR(255),
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);

CREATE TABLE CV_Skills (
  SkillID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
  CVID VARCHAR(255),
  SkillName VARCHAR(100),
  FOREIGN KEY (CVID) REFERENCES CVs(CVID) ON DELETE CASCADE
);


-- Tạo lại bảng CV_Uploads
CREATE TABLE CV_Uploads(
    FileID VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    StudentID VARCHAR(255) NOT NULL,
    Title VARCHAR(255),
    FileName VARCHAR(255) CHARACTER SET utf8mb4,
    File MEDIUMBLOB,
    FileType VARCHAR(100),
    UploadedAt DATETIME(3) DEFAULT NOW(3),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert dữ liệu ngành
SET @major1 := UUID();
INSERT INTO Majors (MajorID, Name, Description)
VALUES (@major1, 'Công nghệ thông tin', 'Ngành đào tạo kỹ sư phần mềm, hệ thống thông tin và mạng máy tính.');

INSERT INTO Specializations (SpecializationID, MajorID, Name, Description)
VALUES
(UUID(), @major1, 'Kỹ thuật phần mềm', 'Phát triển phần mềm ứng dụng, web, mobile.'),
(UUID(), @major1, 'Hệ thống thông tin', 'Xây dựng và quản lý hệ thống thông tin doanh nghiệp.'),
(UUID(), @major1, 'Mạng máy tính', 'Thiết kế và vận hành hệ thống mạng, bảo mật.');

-- Sư phạm Toán học
SET @major2 := UUID();
INSERT INTO Majors (MajorID, Name, Description)
VALUES (@major2, 'Sư phạm Toán học', 'Đào tạo giáo viên Toán cấp phổ thông.');

INSERT INTO Specializations (SpecializationID, MajorID, Name, Description)
VALUES
(UUID(), @major2, 'Toán ứng dụng', 'Ứng dụng Toán học trong kỹ thuật và kinh tế.'),
(UUID(), @major2, 'Giải tích', 'Nghiên cứu hàm số, tích phân và vi phân.');

-- Kinh tế
SET @major3 := UUID();
INSERT INTO Majors (MajorID, Name, Description)
VALUES (@major3, 'Kinh tế', 'Ngành nghiên cứu về phân tích và điều hành hoạt động kinh tế.');

INSERT INTO Specializations (SpecializationID, MajorID, Name, Description)
VALUES
(UUID(), @major3, 'Kinh tế phát triển', 'Phân tích và phát triển kinh tế khu vực.'),
(UUID(), @major3, 'Kinh tế quốc tế', 'Thương mại và chính sách kinh tế quốc tế.');

-- Ngôn ngữ Anh
SET @major4 := UUID();
INSERT INTO Majors (MajorID, Name, Description)
VALUES (@major4, 'Ngôn ngữ Anh', 'Đào tạo cử nhân tiếng Anh ứng dụng và giảng dạy.');

INSERT INTO Specializations (SpecializationID, MajorID, Name, Description)
VALUES
(UUID(), @major4, 'Biên - Phiên dịch', 'Dịch thuật trong các lĩnh vực chuyên ngành.'),
(UUID(), @major4, 'Tiếng Anh thương mại', 'Sử dụng tiếng Anh trong môi trường kinh doanh.');
