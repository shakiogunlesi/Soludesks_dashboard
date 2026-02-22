"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "../../../store/store";
import { clearUser } from "../../../store/userSlice";
import {
  useGetCourseDetailQuery,
  useGetCourseProgressQuery,
  useMarkLessonCompleteMutation,
  useSubmitQuizMutation,
} from "../../../store/apiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface Lesson {
  id: string;
  title: string;
  type?: "lesson" | "quiz";
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  defaultOpen?: boolean;
}

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "short-answer";
  question: string;
  points: number;
  options?: string[];
}

// ─── Static Quiz Questions (content not in API yet) ───────────────────────────
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "What is the purpose of React Hooks?",
    points: 4,
    options: [
      "To use state and other React features in functional components",
      "To create class components",
      "To style React components",
      "To handle routing in React applications",
    ],
  },
  {
    id: "q2",
    type: "multiple-choice",
    question: "Which hook is used for side effects in React?",
    points: 4,
    options: [
      "To use state and other React features in functional components",
      "To create class components",
      "To style React components",
      "To handle routing in React applications",
    ],
  },
  {
    id: "q3",
    type: "short-answer",
    question: "Explain the Virtual DOM and its benefits",
    points: 10,
  },
  {
    id: "q4",
    type: "multiple-choice",
    question: "What is the purpose of React Hooks?",
    points: 4,
    options: [
      "To use state and other React features in functional components",
      "To create class components",
      "To style React components",
      "To handle routing in React applications",
    ],
  },
  {
    id: "q5",
    type: "multiple-choice",
    question: "Which hook is used for side effects in React?",
    points: 4,
    options: [
      "To use state and other React features in functional components",
      "To create class components",
      "To style React components",
      "To handle routing in React applications",
    ],
  },
  {
    id: "q6",
    type: "short-answer",
    question: "Explain the Virtual DOM and its benefits",
    points: 10,
  },
];

// ─── Static Lesson Content (content not in API yet) ───────────────────────────
const LESSON_CONTENT = {
  title: "Lesson 1 - Welcome Message",
  body: [
    { type: "p", text: "Welcome to 'Communicate with Confidence'! In an era where the pace of work is ever-increasing and the demands on our time are relentless, the ability to communicate effectively has never been more crucial. This comprehensive course is meticulously crafted to equip you with the essential skills that will not only enhance your communication abilities but also empower you to thrive in any professional environment you find yourself in." },
    { type: "h2", text: "Why Communication Matters" },
    { type: "p", text: "Effective communication is the cornerstone of success in the workplace. It is the bridge that connects individuals, teams, and organizations, facilitating collaboration and understanding. In today's diverse and dynamic work settings, the ability to convey your thoughts clearly and listen actively is paramount. This course aims to illuminate the significance of communication and provide you with the tools necessary to master it." },
    { type: "h2", text: "What You'll Learn" },
    { type: "p", text: "Throughout this course, you will delve into various aspects of communication, each designed to build upon the last, creating a robust foundation for your skills:" },
    {
      type: "ol",
      items: [
        { bold: "Clear Articulation:", text: " You will learn techniques to express your ideas with clarity and precision, ensuring that your message is understood as intended. This includes understanding your audience and tailoring your message accordingly." },
        { bold: "Active Listening:", text: " Developing the ability to listen actively is crucial. You will practice techniques that enhance your listening skills, enabling you to fully engage with others and respond thoughtfully." },
        { bold: "Confident Conversations:", text: " Navigating challenging discussions can be daunting. This course will provide you with strategies to approach these conversations with poise and assurance, transforming potential conflicts into constructive dialogues." },
        { bold: "Non-Verbal Communication:", text: " Communication is not just about words. You will explore the nuances of non-verbal cues, such as body language and facial expressions, and learn how to utilize them to reinforce your message." },
        { bold: "Persuasive Language:", text: " Crafting compelling arguments is an art. You will learn how to influence others positively through the use of persuasive language, enabling you to advocate for your ideas effectively." },
      ],
    },
    { type: "h2", text: "Building a Collaborative Environment" },
    { type: "p", text: "Mastering these skills will not only enhance your personal communication but will also contribute to building stronger interpersonal relationships within your team. A collaborative work environment is vital for team success, and effective communication is the key to fostering this atmosphere. You will learn how to create an inclusive environment where ideas can flourish, and everyone feels valued." },
    { type: "h2", text: "Course Outcomes" },
    { type: "p", text: "By the end of this transformative course, you will be equipped to:" },
    {
      type: "ul",
      items: [
        "Communicate effectively in any situation, whether in meetings, presentations, or casual conversations.",
        "Navigate complex challenges with confidence, turning potential obstacles into opportunities for growth.",
        "Contribute significantly to your organization's success through improved communication practices, fostering a culture of openness and collaboration.",
      ],
    },
    { type: "p", text: "Join us on this journey to transform your communication skills and unlock new heights in your career! Together, we will explore the depths of effective communication, ensuring that you emerge not just as a better communicator, but as a leader in your field." },
  ],
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6.01594 1.89214L2.4226 4.69214C1.8226 5.15881 1.33594 6.15214 1.33594 6.90547V11.8455C1.33594 13.3921 2.59594 14.6588 4.1426 14.6588H11.8626C13.4093 14.6588 14.6693 13.3921 14.6693 11.8521V6.99881C14.6693 6.19214 14.1293 5.15881 13.4693 4.69881L9.34927 1.81214C8.41594 1.15881 6.91594 1.19214 6.01594 1.89214Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12H9C10.1 12 11 11.1 11 10V8C11 6.9 10.1 6 9 6H7C5.9 6 5 6.9 5 8V10C5 11.1 5.9 12 7 12Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V12" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9H11" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoursesIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M17.9297 13.981V4.92854C17.9297 4.02854 17.1947 3.36104 16.3022 3.43604H16.2572C14.6822 3.57104 12.2897 4.37355 10.9547 5.21355L10.8272 5.29604C10.6097 5.43104 10.2497 5.43104 10.0322 5.29604L9.84469 5.18355C8.50969 4.35105 6.12469 3.55604 4.54969 3.42854C3.65719 3.35354 2.92969 4.02854 2.92969 4.92104V13.981C2.92969 14.701 3.51469 15.376 4.23469 15.466L4.45219 15.496C6.07969 15.7135 8.59219 16.5385 10.0322 17.326L10.0622 17.341C10.2647 17.4535 10.5872 17.4535 10.7822 17.341C12.2222 16.546 14.7422 15.7135 16.3772 15.496L16.6247 15.466C17.3447 15.376 17.9297 14.701 17.9297 13.981Z" stroke={active ? "#0A60E1" : "#636363"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.4248 5.54199V16.792" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.23926 7.79297H5.55176" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.80176 10.0439H5.55176" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClassesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.5 8.33659C2.5 5.19389 2.5 3.62255 3.47631 2.64623C4.45262 1.66992 6.02397 1.66992 9.16667 1.66992H10.8333C13.976 1.66992 15.5474 1.66992 16.5237 2.64623C17.5 3.62255 17.5 5.19389 17.5 8.33659V13.3366H2.5V8.33659Z" stroke="#636363" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M1.66992 13.3301H18.3366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3.33008 18.3301L5.83008 13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M16.6699 18.3301L14.1699 13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10.8366 7.5H9.16992" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66341 9.16341V5.83008L5.83008 6.66341" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.1634 9.16341V5.83008L13.3301 6.66341" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 16.6634V13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AssessmentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.91992 15.0033V5.83659C2.91992 2.50326 3.75326 1.66992 7.08659 1.66992H12.9199C16.2533 1.66992 17.0866 2.50326 17.0866 5.83659V14.1699C17.0866 14.2866 17.0866 14.4033 17.0783 14.5199" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.29492 12.5H17.0866V15.4167C17.0866 17.025 15.7783 18.3333 14.1699 18.3333H5.83659C4.22826 18.3333 2.91992 17.025 2.91992 15.4167V14.875C2.91992 13.5667 3.98659 12.5 5.29492 12.5Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66992 5.83008H13.3366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66992 8.75H10.8366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CertificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.5498 9.18286V13.3245C3.5498 14.8412 3.5498 14.8412 4.98314 15.8079L8.9248 18.0829C9.51647 18.4245 10.4831 18.4245 11.0748 18.0829L15.0165 15.8079C16.4498 14.8412 16.4498 14.8412 16.4498 13.3245V9.18286C16.4498 7.66619 16.4498 7.66619 15.0165 6.69952L11.0748 4.42452C10.4831 4.08286 9.51647 4.08286 8.9248 4.42452L4.98314 6.69952C3.5498 7.66619 3.5498 7.66619 3.5498 9.18286Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5837 6.35835V4.16669C14.5837 2.50002 13.7503 1.66669 12.0837 1.66669H7.91699C6.25033 1.66669 5.41699 2.50002 5.41699 4.16669V6.30002" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5245 9.15909L10.9995 9.90076C11.0745 10.0174 11.2412 10.1341 11.3662 10.1674L12.2162 10.3841C12.7412 10.5174 12.8828 10.9674 12.5412 11.3841L11.9828 12.0591C11.8995 12.1674 11.8328 12.3591 11.8412 12.4924L11.8912 13.3674C11.9245 13.9091 11.5412 14.1841 11.0412 13.9841L10.2245 13.6591C10.0995 13.6091 9.89116 13.6091 9.76616 13.6591L8.94949 13.9841C8.44949 14.1841 8.06616 13.9008 8.09949 13.3674L8.14949 12.4924C8.15782 12.3591 8.09116 12.1591 8.00782 12.0591L7.44949 11.3841C7.10782 10.9674 7.24949 10.5174 7.77449 10.3841L8.62449 10.1674C8.75783 10.1341 8.92449 10.0091 8.99116 9.90076L9.46616 9.15909C9.76616 8.70909 10.2328 8.70909 10.5245 9.15909Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.66699 10.7329V9.26621C1.66699 8.39954 2.37533 7.68287 3.25033 7.68287C4.75866 7.68287 5.37533 6.61621 4.61699 5.30787C4.18366 4.55787 4.44199 3.58287 5.20033 3.14954L6.64199 2.32454C7.30033 1.93287 8.15033 2.16621 8.54199 2.82454L8.63366 2.98287C9.38366 4.29121 10.617 4.29121 11.3753 2.98287L11.467 2.82454C11.8587 2.16621 12.7087 1.93287 13.367 2.32454L14.8087 3.14954C15.567 3.58287 15.8253 4.55787 15.392 5.30787C14.6337 6.61621 15.2503 7.68287 16.7587 7.68287C17.6253 7.68287 18.342 8.39121 18.342 9.26621V10.7329C18.342 11.5995 17.6337 12.3162 16.7587 12.3162C15.2503 12.3162 14.6337 13.3829 15.392 14.6912C15.8253 15.4495 15.567 16.4162 14.8087 16.8495L13.367 17.6745C12.7087 18.0662 11.8587 17.8329 11.467 17.1745L11.3753 17.0162C10.6253 15.7079 9.39199 15.7079 8.63366 17.0162L8.54199 17.1745C8.15033 17.8329 7.30033 18.0662 6.64199 17.6745L5.20033 16.8495C4.44199 16.4162 4.18366 15.4412 4.61699 14.6912C5.37533 13.3829 4.75866 12.3162 3.25033 12.3162C2.37533 12.3162 1.66699 11.5995 1.66699 10.7329Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9.1665 16.6667C13.3086 16.6667 16.6665 13.3088 16.6665 9.16669C16.6665 5.02455 13.3086 1.66669 9.1665 1.66669C5.02437 1.66669 1.6665 5.02455 1.6665 9.16669C1.6665 13.3088 5.02437 16.6667 9.1665 16.6667Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.7755 17.2407C16.2172 18.574 17.2255 18.7073 18.0005 17.5407C18.7088 16.474 18.2422 15.599 16.9588 15.599C16.0088 15.5907 15.4755 16.3323 15.7755 17.2407Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const PointsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1.16669C3.77834 1.16669 1.16667 3.77835 1.16667 7.00002C1.16667 10.2217 3.77834 12.8334 7 12.8334C10.2217 12.8334 12.8333 10.2217 12.8333 7.00002C12.8333 3.77835 10.2217 1.16669 7 1.16669Z" stroke="#636363" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4.66669V7.58335" stroke="#636363" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.99658 9.33331H7.00307" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ─── Quiz Completion Screen ───────────────────────────────────────────────────
function CourseCompletionScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-[#F0F0F0] p-12 gap-6 min-h-[500px]">
      <div className="w-20 h-20 rounded-full bg-[#EAF3FF] flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#0A60E1" strokeWidth="2" fill="none" />
          <path d="M7 12.5l3 3 6-6" stroke="#0A60E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold text-[#202020]">Course Completed!</h2>
        <p className="text-sm text-[#636363] max-w-sm leading-relaxed">
          Congratulations! You have successfully completed{" "}
          <span className="font-semibold text-[#202020]">Effective Workplace Communication</span>.
          Your quiz has been submitted for review.
        </p>
      </div>
      <button
        onClick={onReset}
        className="mt-2 px-8 py-3 bg-[#0A60E1] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Courses
      </button>
    </div>
  );
}

// ─── Quiz View ────────────────────────────────────────────────────────────────
function QuizView({
  onComplete,
  courseId,
}: {
  onComplete: () => void;
  courseId: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

  const handleMCSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      await submitQuiz({ courseId, answers }).unwrap();
    } catch {
      // still proceed to completion screen even on error
    }
    onComplete();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
      <h2 className="text-base font-bold text-[#202020] mb-6">Quiz</h2>
      <div className="flex flex-col gap-6">
        {QUIZ_QUESTIONS.map((q, index) => (
          <div key={q.id} className="flex flex-col gap-3">
            {/* Question Header */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0A60E1] flex items-center justify-center text-white text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#202020] mb-1">{q.question}</p>
                <div className="flex items-center gap-3 text-xs text-[#636363]">
                  <span>{q.type === "multiple-choice" ? "Multiple Choice" : "Short answer"}</span>
                  <span className="w-px h-3 bg-[#D1D5DB]" />
                  <span className="flex items-center gap-1">
                    <PointsIcon />
                    {q.points} points
                  </span>
                </div>
              </div>
            </div>

            {/* Options or Textarea */}
            {q.type === "multiple-choice" && q.options ? (
              <div className="flex flex-col gap-2 pl-11">
                {q.options.map((option, optIdx) => {
                  const optionLabel = String.fromCharCode(65 + optIdx);
                  const isSelected = answers[q.id] === option;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleMCSelect(q.id, option)}
                      className={[
                        "flex items-center gap-3 px-4 py-3 text-sm text-left rounded-lg border transition-all",
                        isSelected
                          ? "border-[#0A60E1] bg-[#EAF3FF] text-[#0A60E1]"
                          : "border-[#E8E8E8] bg-white text-[#4a4a4a] hover:border-[#0A60E1] hover:bg-[#F5F9FF]",
                      ].join(" ")}
                    >
                      <span className={["flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-medium", isSelected ? "border-[#0A60E1] bg-[#0A60E1] text-white" : "border-[#D1D5DB] text-[#636363]"].join(" ")}>
                        {optionLabel}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="pl-11">
                <textarea
                  placeholder="Enter answer here"
                  rows={3}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  className="w-full px-4 py-3 text-sm text-[#4a4a4a] border border-[#E8E8E8] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A60E1] placeholder-[#ADADAD] transition-all"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={[
            "px-16 py-3 text-base font-medium rounded-lg border transition-colors",
            isSubmitting
              ? "text-white bg-[#0A60E1] border-[#0A60E1] opacity-70 cursor-not-allowed"
              : "text-[#0A60E1] bg-white border-[#0A60E1] hover:bg-[#EAF3FF]",
          ].join(" ")}
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar Section ──────────────────────────────────────────────────────────
function SidebarSection({
  section,
  activeSection,
  setActiveSection,
  activeLesson,
  onSelectLesson,
  completedLessons,
  onToggleComplete,
  isCourseCompleted,
  forceOpen = false,
}: {
  section: Section;
  activeSection: string;
  setActiveSection: (id: string) => void;
  activeLesson: string;
  onSelectLesson: (id: string) => void;
  completedLessons: Set<string>;
  onToggleComplete: (id: string) => void;
  isCourseCompleted: boolean;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const coreSectionsWithCheck = new Set(["setup", "navigating", "resources"]);
  const showGreenCheck = isCourseCompleted && coreSectionsWithCheck.has(section.id);
  const shouldShowLessons = !isCourseCompleted || section.id === "assessment";

  return (
    <div className="border-b border-[#F0F0F0] last:border-b-0">
      <button
        className={`flex items-center justify-between w-full px-5 py-4 text-left transition-colors ${
          section.id === activeSection ? "text-[#202020] font-semibold" : "text-[#202020] hover:text-black"
        }`}
        onClick={() => {
          setOpen(!open);
          setActiveSection(section.id);
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[15px]">{section.title}</span>
          {showGreenCheck && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#22C55E" strokeWidth="2" fill="#22C55E" fillOpacity="0.15" />
              <path d="M6 10.5L8.5 13L13 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        {open ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>

      {open && shouldShowLessons && section.lessons.length > 0 && (
        <ul className="pb-3">
          {section.lessons.map((lesson) => {
            const isActive = lesson.id === activeLesson;
            const isCompleted = completedLessons.has(lesson.id);

            return (
              <li key={lesson.id}>
                <div
                  className={`flex items-center justify-between mx-5 my-1 px-4 py-3 text-[14px] rounded-xl cursor-pointer transition-all ${
                    isActive || isCompleted
                      ? "bg-[#EAF3FF] text-[#1D5BD8] font-medium"
                      : "text-[#636363] hover:bg-[#F8FAFC]"
                  }`}
                  onClick={() => {
                    onSelectLesson(lesson.id);
                    setActiveSection(section.id);
                  }}
                >
                  <span className="flex-1">{lesson.title}</span>

                  {lesson.type === "quiz" ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke={isActive ? "#1D5BD8" : "#D1D5DB"} strokeWidth="1.8" />
                    </svg>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(lesson.id);
                      }}
                      className="focus:outline-none"
                    >
                      {isCompleted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#1D5BD8" strokeWidth="2" />
                          <path d="M7 12.5l3 3 6-6" stroke="#1D5BD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="9" stroke={isActive ? "#1D5BD8" : "#D1D5DB"} strokeWidth="1.8" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function UserMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user) ?? {
    name: "Guest",
    email: "guest@example.com",
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <div ref={ref} className="relative flex items-center gap-2 pl-2 border-l border-gray-100">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer group"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          <Image
            src={user.avatar || "/images/Avatars.png"}
            alt={user.name || "User"}
            fill
            className="object-cover"
            sizes="48px"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            {getInitials(user.name)}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-base font-medium text-[#202020] leading-none mb-1.5">
            {user.name || "User"}
          </p>
          <p className="text-sm font-normal text-[#636363] leading-none truncate max-w-[100px]">
            {user.email || "—"}
          </p>
        </div>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden"
          role="menu"
          aria-label="User options"
        >
          {/* User info header */}
          <div className="px-4 py-4 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                <Image
                  src={user.avatar || "/images/Avatars.png"}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                  sizes="40px"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#202020] truncate">{user.name || "User"}</p>
                <p className="text-xs text-[#636363] truncate">{user.email || "—"}</p>
                {user.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium text-[#0A60E1] bg-[#EAF3FF] rounded-full capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              role="menuitem"
              onClick={() => { setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#636363] hover:bg-[#F5F6FA] hover:text-[#202020] transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 10.8334C12.3012 10.8334 14.1667 8.96788 14.1667 6.66669C14.1667 4.3655 12.3012 2.50002 10 2.50002C7.69882 2.50002 5.83334 4.3655 5.83334 6.66669C5.83334 8.96788 7.69882 10.8334 10 10.8334Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.1584 17.5C17.1584 14.425 13.95 11.9584 10 11.9584C6.05002 11.9584 2.84167 14.425 2.84167 17.5" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              My Profile
            </button>

            <button
              role="menuitem"
              onClick={() => { setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#636363] hover:bg-[#F5F6FA] hover:text-[#202020] transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.66699 10.7329V9.26621C1.66699 8.39954 2.37533 7.68287 3.25033 7.68287C4.75866 7.68287 5.37533 6.61621 4.61699 5.30787C4.18366 4.55787 4.44199 3.58287 5.20033 3.14954L6.64199 2.32454C7.30033 1.93287 8.15033 2.16621 8.54199 2.82454L8.63366 2.98287C9.38366 4.29121 10.617 4.29121 11.3753 2.98287L11.467 2.82454C11.8587 2.16621 12.7087 1.93287 13.367 2.32454L14.8087 3.14954C15.567 3.58287 15.8253 4.55787 15.392 5.30787C14.6337 6.61621 15.2503 7.68287 16.7587 7.68287C17.6253 7.68287 18.342 8.39121 18.342 9.26621V10.7329C18.342 11.5995 17.6337 12.3162 16.7587 12.3162C15.2503 12.3162 14.6337 13.3829 15.392 14.6912C15.8253 15.4495 15.567 16.4162 14.8087 16.8495L13.367 17.6745C12.7087 18.0662 11.8587 17.8329 11.467 17.1745L11.3753 17.0162C10.6253 15.7079 9.39199 15.7079 8.63366 17.0162L8.54199 17.1745C8.15033 17.8329 7.30033 18.0662 6.64199 17.6745L5.20033 16.8495C4.44199 16.4162 4.18366 15.4412 4.61699 14.6912C5.37533 13.3829 4.75866 12.3162 3.25033 12.3162C2.37533 12.3162 1.66699 11.5995 1.66699 10.7329Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Account Settings
            </button>
          </div>

          {/* Divider + Logout */}
          <div className="border-t border-[#F0F0F0] py-2">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.41675 6.29999C7.67508 3.29999 9.21675 2.07499 12.5917 2.07499H12.7001C16.4251 2.07499 17.9167 3.56665 17.9167 7.29165V12.725C17.9167 16.45 16.4251 17.9417 12.7001 17.9417H12.5917C9.24175 17.9417 7.70008 16.7333 7.42508 13.7833" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5001 10H3.01672" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.87507 7.20834L2.08340 10L4.87507 12.7917" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CourseLearningPage() {
  const COURSE_ID = "1";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "reviews">("content");
  const [activeLesson, setActiveLesson] = useState("1-1");
  const [activeSection, setActiveSection] = useState("introduction");
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // ── Redux user ──
  const user = useSelector((state: RootState) => state.user) ?? {
    name: "Guest",
    email: "guest@example.com",
  };

  // ── API data ──
  const { data: courseData, isLoading: courseLoading } = useGetCourseDetailQuery(COURSE_ID);
  const { data: progressData } = useGetCourseProgressQuery(COURSE_ID);
  const [markLessonComplete] = useMarkLessonCompleteMutation();

  // Derive sections from API; fall back to empty while loading
  const sections: Section[] = courseData?.sections ?? [];

  // Derive completed lessons — seed from API progress, then merge local state
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set());

  // Once progress loads, hydrate local state
  useEffect(() => {
    if (progressData?.completedLessons?.length) {
      setLocalCompleted(new Set(progressData.completedLessons));
    }
    if (progressData?.quizSubmitted) {
      setQuizSubmitted(true);
    }
  }, [progressData]);

  // Combined completed set (API seed + local additions)
  const completedLessons = localCompleted;

  // Total non-quiz lessons across all sections
  const allLessonIds = sections
    .flatMap((s) => s.lessons)
    .filter((l) => l.type !== "quiz")
    .map((l) => l.id);

  const totalLessons = allLessonIds.length;

  // Auto-complete detection
  useEffect(() => {
    if (
      totalLessons > 0 &&
      allLessonIds.every((id) => completedLessons.has(id))
    ) {
      setCourseCompleted(true);
      setActiveSection("assessment");
      setActiveLesson("5-quiz");
      setShowQuiz(true);
    }
  }, [completedLessons, totalLessons]);

  // ── Handlers ──
  const handleToggleComplete = async (id: string) => {
    setLocalCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    // Fire-and-forget API call
    markLessonComplete({ courseId: COURSE_ID, lessonId: id }).catch(() => {});
  };

  const handleMarkCurrentComplete = () => {
    const willBeCompleted = new Set([...completedLessons, activeLesson]);
    handleToggleComplete(activeLesson);

    if (allLessonIds.every((id) => willBeCompleted.has(id))) {
      setCourseCompleted(true);
      setActiveSection("assessment");
      setActiveLesson("5-quiz");
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = () => {
    setLocalCompleted((prev) => new Set([...prev, "5-quiz"]));
    setQuizSubmitted(true);
  };

  const handleReset = () => {
    setQuizSubmitted(false);
    setShowQuiz(false);
    setCourseCompleted(false);
    setLocalCompleted(new Set());
    setActiveLesson("1-1");
    setActiveSection("introduction");
  };

  const isQuizActive = activeLesson === "5-quiz" || showQuiz;

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { label: "Courses/Materials", href: "/courses/effective-workplace-communication/courselearning", icon: <CoursesIcon active />, active: true },
    { label: "Classes", href: "#", icon: <ClassesIcon /> },
    { label: "Assessments", href: "#", icon: <AssessmentsIcon /> },
    { label: "My Certification", href: "#", icon: <CertificationIcon /> },
    { label: "Settings", href: "#", icon: <SettingsIcon /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ── Sidebar ── */}
      <aside className={["fixed lg:static inset-y-0 left-0 z-40 w-[210px]", "bg-white border-r border-[#F0F0F0] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.08)]", "flex flex-col transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"].join(" ")}>
        <div className="flex items-center py-5 border-b border-[#F0F0F0]">
          <Image src="/icons/logo.svg" alt="Soludesks logo" width={136} height={36} priority />
        </div>
        <nav className="flex flex-col flex-1 gap-5 px-4 py-4" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={["flex items-center gap-3 px-2 py-1.5 rounded-sm text-sm transition-all", item.active ? "bg-[#EAF3FF] text-[#0A60E1] font-semibold border-l-4 border-[#0A60E1]" : "text-[#636363] font-normal hover:text-[#0A60E1] hover:bg-gray-50"].join(" ")}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ── Topbar ── */}
        <header className="flex flex-shrink-0 items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100">
          <div className="flex flex-1 items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative w-full max-w-xs">
              <label htmlFor="header-search" className="sr-only">Search Soludesk</label>
              <input id="header-search" type="search" placeholder="Search soludesk" className="w-full pl-4 pr-12 py-2.5 text-base rounded-full border border-[#F0F0F0] text-[#636363] placeholder-[#636363] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)} />
              <SearchIcon />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors" aria-label="Messages">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 10V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H14" stroke="#0A60E1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.5 7C20.8807 7 22 5.88071 22 4.5C22 3.11929 20.8807 2 19.5 2C18.1193 2 17 3.11929 17 4.5C17 5.88071 18.1193 7 19.5 7Z" fill="#0A60E1" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.9965 11H16.0054" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.9945 11H12.0035" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.99451 11H8.00349" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="relative p-2 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors" aria-label="Notifications">
              <svg width="25" height="28" viewBox="0 0 25 28" fill="none" aria-hidden="true">
                <path d="M12.0196 6.91016C8.7096 6.91016 6.0196 9.60016 6.0196 12.9102V15.8002C6.0196 16.4102 5.7596 17.3402 5.4496 17.8602L4.2996 19.7702C3.5896 20.9502 4.0796 22.2602 5.3796 22.7002C9.6896 24.1402 14.3396 24.1402 18.6496 22.7002C19.8596 22.3002 20.3896 20.8702 19.7296 19.7702L18.5796 17.8602C18.2796 17.3402 18.0196 16.4102 18.0196 15.8002V12.9102C18.0196 9.61016 15.3196 6.91016 12.0196 6.91016Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M13.8699 7.19945C13.5599 7.10945 13.2399 7.03945 12.9099 6.99945C11.9499 6.87945 11.0299 6.94945 10.1699 7.19945C10.4599 6.45945 11.1799 5.93945 12.0199 5.93945C12.8599 5.93945 13.5799 6.45945 13.8699 7.19945Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.0195 23.0605C15.0195 24.7105 13.6695 26.0605 12.0195 26.0605C11.1995 26.0605 10.4395 25.7205 9.89953 25.1805C9.35953 24.6405 9.01953 23.8805 9.01953 23.0605" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" />
                <rect x="10" width="15" height="15" rx="7.5" fill="#FF5025" />
                <path d="M13.9056 10.1904V8.94994L17.0159 4.04989H18.0854V5.76691H17.4525L15.4917 8.86991V8.92811H19.9116V10.1904H13.9056ZM17.4816 11.5V9.81208L17.5107 9.26278V4.04989H18.9876V11.5H17.4816Z" fill="#FDFDFD" />
              </svg>
            </button>

            <UserMenu />
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto bg-[#F5F6FA]">
          <div className="flex flex-col lg:flex-row gap-5 px-6 py-6 max-w-[1400px]">

            {/* ── Left Column ── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/courses/effective-workplace-communication" className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E8E8E8] hover:bg-gray-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" stroke="#636363" />
                  </svg>
                </Link>
                {courseLoading ? (
                  <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <h1 className="text-xl font-medium text-[#202020]">
                    {courseData?.course?.title ?? "Effective Workplace Communication"}
                  </h1>
                )}
              </div>

              {/* Quiz submitted → completion screen */}
              {quizSubmitted ? (
                <CourseCompletionScreen onReset={handleReset} />
              ) : (
                <>
                  {/* Video thumbnail — hidden when quiz active */}
                  {!isQuizActive && (
                    <div className="relative w-full max-h-[450px] aspect-video rounded-2xl overflow-hidden bg-gray-900 mb-5">
                      <Image
                        src="/images/lesson-bg.png"
                        alt="Course video thumbnail"
                        fill
                        className="object-cover opacity-80"
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        priority
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://placehold.co/900x506/1e293b/94a3b8?text=Course+Video";
                        }}
                      />
                      <button className="absolute inset-0 flex items-center justify-center group" aria-label="Play video">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M8 5.14v14l11-7-11-7z" fill="#0A60E1" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Tabs — hidden when quiz active */}
                  {!isQuizActive && (
                    <div className="flex gap-0 mb-5 border-b border-[#F0F0F0]">
                      <button
                        onClick={() => setActiveTab("content")}
                        className={`px-4 pb-3 text-base transition-all border-b-2 -mb-px ${
                          activeTab === "content" ? "font-bold text-[#0A60E1] border-[#0A60E1]" : "text-[#636363] border-transparent hover:text-[#202020]"
                        }`}
                      >
                        Course Content
                      </button>
                      <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-4 pb-3 text-base transition-all border-b-2 -mb-px ${
                          activeTab === "reviews" ? "font-bold text-[#0A60E1] border-[#0A60E1]" : "text-[#636363] border-transparent hover:text-[#202020]"
                        }`}
                      >
                        Review/Feedbacks
                      </button>
                    </div>
                  )}

                  {/* Quiz or Content or Reviews */}
                  {isQuizActive ? (
                    <QuizView onComplete={handleQuizComplete} courseId={COURSE_ID} />
                  ) : activeTab === "content" ? (
                    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
                      <h2 className="text-base font-bold text-[#202020] mb-4">
                        {LESSON_CONTENT.title}
                      </h2>
                      <div className="flex flex-col gap-3 text-sm text-[#4a4a4a] leading-relaxed">
                        {LESSON_CONTENT.body.map((block, i) => {
                          if (block.type === "h2")
                            return <h3 key={i} className="text-sm font-bold text-[#202020] mt-2">{block.text}</h3>;
                          if (block.type === "p")
                            return <p key={i}>{block.text}</p>;
                          if (block.type === "ol" && block.items)
                            return (
                              <ol key={i} className="flex flex-col gap-2 list-decimal pl-6">
                                {block.items.map((item, j) => (
                                  <li key={j}>
                                    <span className="font-bold text-[#202020]">{(item as { bold: string; text: string }).bold}</span>
                                    {(item as { bold: string; text: string }).text}
                                  </li>
                                ))}
                              </ol>
                            );
                          if (block.type === "ul" && block.items)
                            return (
                              <ul key={i} className="flex flex-col gap-1.5 list-disc pl-6">
                                {block.items.map((item, j) => (
                                  <li key={j}>{typeof item === "string" ? item : item.text}</li>
                                ))}
                              </ul>
                            );
                          return null;
                        })}
                      </div>

                      <div className="flex justify-end mt-8">
                        <button
                          onClick={handleMarkCurrentComplete}
                          className={[
                            "px-6 py-3 text-base font-[400] rounded-lg border transition-colors",
                            completedLessons.has(activeLesson)
                              ? "text-white bg-[#0A60E1] border-[#0A60E1] hover:bg-blue-700"
                              : "text-[#0A60E1] bg-white border-[#0A60E1] hover:bg-[#EAF3FF]",
                          ].join(" ")}
                        >
                          {completedLessons.has(activeLesson) ? "Completed ✓" : "Mark as complete"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
                      <p className="text-sm text-[#636363]">No reviews yet for this lesson.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Right Sidebar (Lessons Panel) ── */}
            <div className="w-full max-w-[407px] flex-shrink-0">
              <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
                <div className="px-4 py-3.5 border-b border-[#F0F0F0]">
                  {courseLoading ? (
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-sm font-semibold text-[#202020]">
                      Lessons ({completedLessons.size}/{totalLessons})
                    </p>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                  {courseLoading ? (
                    <div className="p-4 space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    sections.map((section) => {
                      if (courseCompleted && section.id === "introduction") return null;
                      if (courseCompleted && section.lessons.length > 0 && section.id !== "assessment") return null;

                      return (
                        <SidebarSection
                          key={section.id}
                          section={section}
                          activeSection={activeSection}
                          setActiveSection={setActiveSection}
                          activeLesson={activeLesson}
                          onSelectLesson={setActiveLesson}
                          completedLessons={completedLessons}
                          onToggleComplete={handleToggleComplete}
                          isCourseCompleted={courseCompleted}
                          forceOpen={courseCompleted && section.id === "assessment"}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}