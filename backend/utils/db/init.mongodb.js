use("Jobiverse");

// Users collection
db.users.insertMany([
  {
    _id: ObjectId("644c5c1eb83f1f3a7a000001"),
    email: "student1@example.com",
    password: "hashed_password",
    role: "student",
    createdAt: new Date()
  },
  {
    _id: ObjectId("644c5c1eb83f1f3a7a000002"),
    email: "employer1@example.com",
    password: "hashed_password",
    role: "employer",
    createdAt: new Date()
  }
]);

// Students collection
db.students.insertOne({
  _id: ObjectId("644c5c1eb83f1f3a7a000001"), // same as UserID
  mssv: "SV001",
  name: "Nguyen Van A",
  major: "Computer Science",
  interests: "Web Development, AI",
  university: "HCMUT",
  avatarURL: "https://example.com/avatar1.png"
});

// Employers collection
db.employers.insertOne({
  _id: ObjectId("644c5c1eb83f1f3a7a000002"), // same as UserID
  companyName: "Tech Co.",
  representativeName: "Tran Thi B",
  position: "HR Manager",
  interests: "Hiring interns, Web projects",
  industry: "Technology",
  companyInfo: "We build software solutions."
});

// Projects collection
db.projects.insertOne({
  _id: ObjectId(),
  employerID: ObjectId("644c5c1eb83f1f3a7a000002"),
  studentID: ObjectId("644c5c1eb83f1f3a7a000001"),
  title: "Build Landing Page",
  description: "Create a landing page for our new product.",
  skillsRequired: "HTML, CSS, JavaScript",
  benefits: "Certificate, Experience",
  workingTime: "Flexible",
  status: "open",
  createdAt: new Date()
});

// Applications collection
db.applications.insertOne({
  studentID: ObjectId("644c5c1eb83f1f3a7a000001"),
  projectID: ObjectId("644c5c1eb83f1f3a7a000003"), // giả lập ProjectID
  status: "pending",
  appliedAt: new Date()
});

// Notifications collection
db.notifications.insertOne({
  userID: ObjectId("644c5c1eb83f1f3a7a000001"),
  content: "You have been invited to a project",
  isRead: false,
  createdAt: new Date()
});

// CV collection
db.cv.insertOne({
  studentID: ObjectId("644c5c1eb83f1f3a7a000001"),
  content: "Rich CV content",
  lastUpdated: new Date()
});

// ProjectInvites collection
db.projectInvites.insertOne({
  projectID: ObjectId("644c5c1eb83f1f3a7a000003"),
  studentID: ObjectId("644c5c1eb83f1f3a7a000001"),
  status: "invited",
  invitedAt: new Date()
});
