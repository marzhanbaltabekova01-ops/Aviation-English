export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: Specialization;
  avatarUrl?: string;
  createdAt: string;
  role?: "USER" | "ADMIN"; // ← добавь эту строку
}

export type Specialization =
  | "PILOT_COMMERCIAL"
  | "PILOT_PRIVATE"
  | "ATC_CONTROLLER"
  | "CABIN_CREW"
  | "STUDENT"
  | "ENGINEER";

export interface Course {
  id: string;
  title: string;
  titleKz?: string;         // ← добавь ?
  description: string;
  descriptionKz?: string;   // ← добавь
  level: CourseLevel;
  thumbnailUrl: string;
  thumbnail?: string;
  price: number;
  currency: string;
  lessonsCount: number;
  duration: number;
  studentsCount: number;
  lessons?: Lesson[];
}

export type CourseLevel =
  | "Pre-Aviation"
  | "ICAO Level 3"
  | "ICAO Level 4"
  | "ICAO Level 5-6"
  | "Corporate";

export interface LessonSummary {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  isFree: boolean;
  duration: number;
  isCompleted: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleKz?: string;         // ← добавь
  type: LessonType;
  duration: number;
  order: number;
  isFree: boolean;
  isCompleted?: boolean;
  content?: LessonContent;
  courseTitle?: string;
  course?: { id: string; title: string };
  courseLessons?: LessonSummary[];
}

export type LessonType = "LISTENING" | "QUIZ" | "VOCABULARY" | "READING";

export interface LessonContent {
  // LISTENING
  audioUrl?: string;
  transcript?: string;
  keyPhrases?: string[];
  vocabulary?: VocabularyItem[];
  icaoRule?: string;
  // QUIZ
  questions?: QuizQuestion[];
  // VOCABULARY
  vocabularyItems?: VocabularyItem[];
  topic?: string;
  // READING
  article?: {
    title: string;
    paragraphs: string[];
    keyPoints: string[];
  };
}

export interface VocabularyItem {
  word: string;
  translation: string;
  example?: string;
  pronunciation?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionKz?: string;     // ← добавь
  options: string[];
  optionsKz?: string[];    // ← добавь
  correctAnswer: number;
  explanation: string;
  explanationKz?: string;  // ← добавь
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  course?: Course;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  specialization: Specialization;
}

export interface DashboardStats {
  streakDays: number;
  lessonsCompleted: number;
  icaoProgress: number;
  coursesCompleted: number;
}

export interface ICAOLevel {
  level: number;
  name: string;
  pronunciation: string;
  structure: string;
  vocabulary: string;
  fluency: string;
  comprehension: string;
  validityPeriod: string;
}
