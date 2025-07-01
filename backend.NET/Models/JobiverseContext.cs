using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

public partial class JobiverseContext : DbContext
{
    public JobiverseContext()
    {
    }

    public JobiverseContext(DbContextOptions<JobiverseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Cv> Cvs { get; set; }

    public virtual DbSet<CvAchievement> CvAchievements { get; set; }

    public virtual DbSet<CvActivity> CvActivities { get; set; }

    public virtual DbSet<CvEducation> CvEducations { get; set; }

    public virtual DbSet<CvExperience> CvExperiences { get; set; }

    public virtual DbSet<CvLanguage> CvLanguages { get; set; }

    public virtual DbSet<CvSkill> CvSkills { get; set; }

    public virtual DbSet<CvSocial> CvSocials { get; set; }

    public virtual DbSet<CvUpload> CvUploads { get; set; }

    public virtual DbSet<Employer> Employers { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<Major> Majors { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ProjectApplicant> ProjectApplicants { get; set; }

    public virtual DbSet<ProjectLocation> ProjectLocations { get; set; }

    public virtual DbSet<ProjectMajor> ProjectMajors { get; set; }

    public virtual DbSet<ProjectSpecialization> ProjectSpecializations { get; set; }

    public virtual DbSet<Specialization> Specializations { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentsInterest> StudentsInterests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=mysql-2a1c0cf2-nhattruong13112000-ee54.l.aivencloud.com;port=15833;database=Jobiverse;user=avnadmin;password=AVNS_-F7ERqsyjg4XaRBB0oh;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PRIMARY");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("AccountID");
            entity.Property(e => e.AccountRole).HasColumnType("enum('admin','employer','student')");
            entity.Property(e => e.AuthProvider).HasColumnType("enum('local','google','facebook')");
            entity.Property(e => e.Avatar).HasColumnType("mediumblob");
            entity.Property(e => e.AvatarType).HasMaxLength(50);
            entity.Property(e => e.Deleted).HasDefaultValueSql("'0'");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Profile).HasDefaultValueSql("'0'");
        });

        modelBuilder.Entity<Cv>(entity =>
        {
            entity.HasKey(e => e.Cvid).HasName("PRIMARY");

            entity.ToTable("CVs");

            entity.HasIndex(e => e.StudentId, "StudentID");

            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("CVID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Avatar).HasMaxLength(255);
            entity.Property(e => e.Birthday).HasColumnType("date");
            entity.Property(e => e.Deleted).HasDefaultValueSql("'0'");
            entity.Property(e => e.DesiredPosition).HasMaxLength(150);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Gender).HasMaxLength(50);
            entity.Property(e => e.LastUpdated)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.StudentId)
                .HasMaxLength(50)
                .HasColumnName("StudentID");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.Website).HasMaxLength(150);

            entity.HasOne(d => d.Student).WithMany(p => p.Cvs)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("CVs_ibfk_1");
        });

        modelBuilder.Entity<CvAchievement>(entity =>
        {
            entity.HasKey(e => e.AchievementId).HasName("PRIMARY");

            entity.ToTable("CV_Achievements");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.AchievementId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("AchievementID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Title).HasMaxLength(150);

            entity.HasOne(d => d.Cv).WithMany(p => p.CvAchievements)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Achievements_ibfk_1");
        });

        modelBuilder.Entity<CvActivity>(entity =>
        {
            entity.HasKey(e => e.ActivityId).HasName("PRIMARY");

            entity.ToTable("CV_Activities");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.ActivityId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("ActivityID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.EndDate).HasColumnType("date");
            entity.Property(e => e.Organization).HasMaxLength(150);
            entity.Property(e => e.StartDate).HasColumnType("date");
            entity.Property(e => e.Title).HasMaxLength(150);

            entity.HasOne(d => d.Cv).WithMany(p => p.CvActivities)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Activities_ibfk_1");
        });

        modelBuilder.Entity<CvEducation>(entity =>
        {
            entity.HasKey(e => e.EducationId).HasName("PRIMARY");

            entity.ToTable("CV_Educations");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.EducationId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("EducationID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Degree).HasMaxLength(150);
            entity.Property(e => e.EndDate).HasColumnType("date");
            entity.Property(e => e.School).HasMaxLength(150);
            entity.Property(e => e.StartDate).HasColumnType("date");

            entity.HasOne(d => d.Cv).WithMany(p => p.CvEducations)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Educations_ibfk_1");
        });

        modelBuilder.Entity<CvExperience>(entity =>
        {
            entity.HasKey(e => e.ExperienceId).HasName("PRIMARY");

            entity.ToTable("CV_Experiences");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.ExperienceId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("ExperienceID");
            entity.Property(e => e.Company).HasMaxLength(150);
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.EndDate).HasColumnType("date");
            entity.Property(e => e.Position).HasMaxLength(150);
            entity.Property(e => e.StartDate).HasColumnType("date");

            entity.HasOne(d => d.Cv).WithMany(p => p.CvExperiences)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Experiences_ibfk_1");
        });

        modelBuilder.Entity<CvLanguage>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PRIMARY");

            entity.ToTable("CV_Languages");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.LanguageId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("LanguageID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Language).HasMaxLength(100);
            entity.Property(e => e.Level).HasMaxLength(100);

            entity.HasOne(d => d.Cv).WithMany(p => p.CvLanguages)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Languages_ibfk_1");
        });

        modelBuilder.Entity<CvSkill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PRIMARY");

            entity.ToTable("CV_Skills");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.SkillId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("SkillID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.SkillName).HasMaxLength(100);

            entity.HasOne(d => d.Cv).WithMany(p => p.CvSkills)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Skills_ibfk_1");
        });

        modelBuilder.Entity<CvSocial>(entity =>
        {
            entity.HasKey(e => e.SocialId).HasName("PRIMARY");

            entity.ToTable("CV_Socials");

            entity.HasIndex(e => e.Cvid, "CVID");

            entity.Property(e => e.SocialId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("SocialID");
            entity.Property(e => e.Cvid)
                .HasMaxLength(50)
                .HasColumnName("CVID");
            entity.Property(e => e.Link).HasMaxLength(255);
            entity.Property(e => e.Platform).HasMaxLength(100);

            entity.HasOne(d => d.Cv).WithMany(p => p.CvSocials)
                .HasForeignKey(d => d.Cvid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CV_Socials_ibfk_1");
        });

        modelBuilder.Entity<CvUpload>(entity =>
        {
            entity.HasKey(e => e.FileId).HasName("PRIMARY");

            entity.ToTable("CV_Uploads");

            entity.HasIndex(e => e.StudentId, "StudentID");

            entity.Property(e => e.FileId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("FileID");
            entity.Property(e => e.File).HasColumnType("mediumblob");
            entity.Property(e => e.FileName).HasMaxLength(255);
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.StudentId)
                .HasMaxLength(50)
                .HasColumnName("StudentID");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");

            entity.HasOne(d => d.Student).WithMany(p => p.CvUploads)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("CV_Uploads_ibfk_1");
        });

        modelBuilder.Entity<Employer>(entity =>
        {
            entity.HasKey(e => e.EmployerId).HasName("PRIMARY");

            entity.HasIndex(e => e.AccountId, "AccountID").IsUnique();

            entity.Property(e => e.EmployerId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("EmployerID");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasColumnName("AccountID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.BusinessScale).HasColumnType("enum('Private individuals','Companies')");
            entity.Property(e => e.CompanyInfo).HasMaxLength(100);
            entity.Property(e => e.CompanyName).HasMaxLength(250);
            entity.Property(e => e.Industry).HasMaxLength(100);
            entity.Property(e => e.Position).HasMaxLength(100);
            entity.Property(e => e.Prove).HasMaxLength(100);
            entity.Property(e => e.RepresentativeName).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithOne(p => p.Employer)
                .HasForeignKey<Employer>(d => d.AccountId)
                .HasConstraintName("Employers_ibfk_1");
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => new { e.AccountId, e.ProjectId }).HasName("PRIMARY");

            entity.HasIndex(e => e.ProjectId, "ProjectID");

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasColumnName("AccountID");
            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasColumnName("ProjectID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");

            entity.HasOne(d => d.Account).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("Favorites_ibfk_2");

            entity.HasOne(d => d.Project).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("Favorites_ibfk_1");
        });

        modelBuilder.Entity<Major>(entity =>
        {
            entity.HasKey(e => e.MajorId).HasName("PRIMARY");

            entity.Property(e => e.MajorId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("MajorID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PRIMARY");

            entity.HasIndex(e => e.AccountId, "AccountID");

            entity.Property(e => e.NotificationId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("NotificationID");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasColumnName("AccountID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.Deleted).HasDefaultValueSql("'0'");
            entity.Property(e => e.IsRead).HasDefaultValueSql("'0'");

            entity.HasOne(d => d.Account).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Notifications_ibfk_1");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.ProjectId).HasName("PRIMARY");

            entity.HasIndex(e => e.AccountId, "AccountID");

            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("ProjectID");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasColumnName("AccountID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.Deadline).HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValueSql("'0'");
            entity.Property(e => e.HiringCount).HasDefaultValueSql("'1'");
            entity.Property(e => e.Salary).HasPrecision(10);
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'open'")
                .HasColumnType("enum('open','closed','in-progress')");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.WorkType)
                .HasDefaultValueSql("'online'")
                .HasColumnType("enum('online','offline')");
            entity.Property(e => e.WorkingTime).HasMaxLength(100);

            entity.HasOne(d => d.Account).WithMany(p => p.Projects)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("Projects_ibfk_1");
        });

        modelBuilder.Entity<ProjectApplicant>(entity =>
        {
            entity.HasKey(e => new { e.ProjectId, e.StudentId }).HasName("PRIMARY");

            entity.HasIndex(e => e.StudentId, "StudentID");

            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasColumnName("ProjectID");
            entity.Property(e => e.StudentId)
                .HasMaxLength(50)
                .HasColumnName("StudentID");
            entity.Property(e => e.AppliedAt)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.CoverLetter).HasColumnType("text");
            entity.Property(e => e.Cv).HasMaxLength(50);
            entity.Property(e => e.CvType).HasMaxLength(20);
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'pending'")
                .HasColumnType("enum('pending','rejected','accepted','invited','declinedInvitation')");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectApplicants)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("ProjectApplicants_ibfk_1");

            entity.HasOne(d => d.Student).WithMany(p => p.ProjectApplicants)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("ProjectApplicants_ibfk_2");
        });

        modelBuilder.Entity<ProjectLocation>(entity =>
        {
            entity.HasKey(e => e.ProjectId).HasName("PRIMARY");

            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasColumnName("ProjectID");
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.Province).HasMaxLength(100);
            entity.Property(e => e.Ward).HasMaxLength(100);

            entity.HasOne(d => d.Project).WithOne(p => p.ProjectLocation)
                .HasForeignKey<ProjectLocation>(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ProjectLocations_ibfk_1");
        });

        modelBuilder.Entity<ProjectMajor>(entity =>
        {
            entity.HasKey(e => new { e.ProjectId, e.MajorId }).HasName("PRIMARY");

            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasColumnName("ProjectID");
            entity.Property(e => e.MajorId)
                .HasMaxLength(50)
                .HasColumnName("MajorID");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectMajors)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ProjectMajors_ibfk_1");
        });

        modelBuilder.Entity<ProjectSpecialization>(entity =>
        {
            entity.HasKey(e => new { e.ProjectId, e.SpecializationId }).HasName("PRIMARY");

            entity.Property(e => e.ProjectId)
                .HasMaxLength(50)
                .HasColumnName("ProjectID");
            entity.Property(e => e.SpecializationId)
                .HasMaxLength(50)
                .HasColumnName("SpecializationID");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectSpecializations)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("ProjectSpecializations_ibfk_1");
        });

        modelBuilder.Entity<Specialization>(entity =>
        {
            entity.HasKey(e => e.SpecializationId).HasName("PRIMARY");

            entity.HasIndex(e => e.MajorId, "MajorID");

            entity.Property(e => e.SpecializationId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("SpecializationID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.MajorId)
                .HasMaxLength(50)
                .HasColumnName("MajorID");
            entity.Property(e => e.Name).HasMaxLength(255);

            entity.HasOne(d => d.Major).WithMany(p => p.Specializations)
                .HasForeignKey(d => d.MajorId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Specializations_ibfk_1");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PRIMARY");

            entity.HasIndex(e => e.AccountId, "AccountID").IsUnique();

            entity.HasIndex(e => e.MajorId, "MajorID");

            entity.HasIndex(e => e.SpecializationId, "SpecializationID");

            entity.Property(e => e.StudentId)
                .HasMaxLength(50)
                .HasDefaultValueSql("'uuid()'")
                .HasColumnName("StudentID");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .HasColumnName("AccountID");
            entity.Property(e => e.DefaultCvId).HasMaxLength(50);
            entity.Property(e => e.DefaultCvType).HasColumnType("enum('CV','CVUpload')");
            entity.Property(e => e.MajorId)
                .HasMaxLength(50)
                .HasColumnName("MajorID");
            entity.Property(e => e.Mssv)
                .HasMaxLength(20)
                .HasColumnName("MSSV");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SpecializationId)
                .HasMaxLength(50)
                .HasColumnName("SpecializationID");
            entity.Property(e => e.University).HasMaxLength(150);

            entity.HasOne(d => d.Account).WithOne(p => p.Student)
                .HasForeignKey<Student>(d => d.AccountId)
                .HasConstraintName("Students_ibfk_1");

            entity.HasOne(d => d.Major).WithMany(p => p.Students)
                .HasForeignKey(d => d.MajorId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Students_ibfk_2");

            entity.HasOne(d => d.Specialization).WithMany(p => p.Students)
                .HasForeignKey(d => d.SpecializationId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Students_ibfk_3");
        });

        modelBuilder.Entity<StudentsInterest>(entity =>
        {
            entity.HasKey(e => new { e.StudentId, e.Interest }).HasName("PRIMARY");

            entity.Property(e => e.StudentId)
                .HasMaxLength(50)
                .HasColumnName("StudentID");
            entity.Property(e => e.Interest).HasMaxLength(150);

            entity.HasOne(d => d.Student).WithMany(p => p.StudentsInterests)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("StudentsInterests_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
