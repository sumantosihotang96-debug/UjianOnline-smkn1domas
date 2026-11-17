import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: integer("role_id").references(() => roles.id),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  nisn: text("nisn").notNull().unique(),
  fullName: text("full_name").notNull(),
  classId: integer("class_id").references(() => classes.id),
  religion: text("religion"),
  selectedSubjects: text("selected_subjects", { mode: "json" }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  nip: text("nip").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const teacherSubjects = sqliteTable("teacher_subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teacherId: integer("teacher_id").references(() => teachers.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const exams = sqliteTable("exams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  startTime: text("start_time"),
  endTime: text("end_time"),
  durationMinutes: integer("duration_minutes").default(60),
  isGpsRequired: integer("is_gps_required", { mode: "boolean" }).default(false),
  gpsRadiusMeters: integer("gps_radius_meters").default(0),
  gpsLocationName: text("gps_location_name"),
  token: text("token"),
  status: text("status", { enum: ["draft", "published", "running", "finished", "archived"] }).default("draft"),
  showScoresImmediately: integer("show_scores_immediately", { mode: "boolean" }).default(false),
  showDiscussion: integer("show_discussion", { mode: "boolean" }).default(false),
  randomizeQuestions: integer("randomize_questions", { mode: "boolean" }).default(false),
  randomizeOptions: integer("randomize_options", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const examParticipants = sqliteTable("exam_participants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id").references(() => exams.id),
  studentId: integer("student_id").references(() => students.id),
  status: text("status", { enum: ["pending", "started", "submitted", "completed"] }).default("pending"),
  startedAt: text("started_at"),
  submittedAt: text("submitted_at"),
  score: real("score").default(0),
  violationCount: integer("violation_count").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id").references(() => exams.id),
  questionText: text("question_text").notNull(),
  imageUrl: text("image_url"),
  correctAnswer: text("correct_answer"),
  points: integer("points").default(1),
  orderIndex: integer("order_index").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const questionOptions = sqliteTable("question_options", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: integer("question_id").references(() => questions.id),
  label: text("label").notNull(),
  text: text("text").notNull(),
  imageUrl: text("image_url"),
  isCorrect: integer("is_correct", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const studentAnswers = sqliteTable("student_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id").references(() => exams.id),
  studentId: integer("student_id").references(() => students.id),
  questionId: integer("question_id").references(() => questions.id),
  selectedAnswer: text("selected_answer"),
  isCorrect: integer("is_correct", { mode: "boolean" }).default(false),
  scoreEarned: real("score_earned").default(0),
  answeredAt: text("answered_at").default("CURRENT_TIMESTAMP"),
});

export const violations = sqliteTable("violations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id").references(() => exams.id),
  studentId: integer("student_id").references(() => students.id),
  type: text("type").notNull(),
  details: text("details"),
  occurredAt: text("occurred_at").default("CURRENT_TIMESTAMP"),
  status: text("status", { enum: ["warning", "counted", "auto_submit"] }).default("warning"),
});

export const resetExamLogs = sqliteTable("reset_exam_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id").references(() => exams.id),
  studentId: integer("student_id").references(() => students.id),
  adminId: integer("admin_id").references(() => users.id),
  reason: text("reason"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
