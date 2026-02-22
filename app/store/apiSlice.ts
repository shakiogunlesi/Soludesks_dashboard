
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'


export interface Course {
  id: string
  title: string
  description: string
  category: string         
  image: string
}

export interface Learner {
  id: string
  name: string
  city: string
  email: string
  avatar: string
}

export interface Lesson {
  id: string
  title: string
  type?: 'lesson' | 'quiz'
  contentKey?: string       
}

export interface Section {
  id: string
  title: string
  lessons: Lesson[]
  defaultOpen?: boolean
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: 'admin' | 'learner' | 'instructor'
}

// ────────────────────────────────────────────────────────────────
// Main API definition
// ────────────────────────────────────────────────────────────────

export const apiSlice = createApi({
  reducerPath: 'api',

  // Later: change to fetchBaseQuery({ baseUrl: 'https://api.yourdomain.com' })
  baseQuery: fakeBaseQuery(),

  tagTypes: [
    'User',             // current logged-in user
    'Courses',          // list of all courses
    'CourseDetail',     // single course + learners + sections
    'Progress',         // user progress per course
  ],

  endpoints: (builder) => ({

    // ── AUTH ───────────────────────────────────────────────────────

    login: builder.mutation<
      { token: string; user: UserProfile },
      { email: string; password: string }
    >({
      async queryFn({ email, password }) {
        await new Promise(r => setTimeout(r, 900)) // fake network delay

        // Your current demo credentials
        if (email === "shaki_ogunlesi@outlook.com" && password === "admin125@#") {
          return {
            data: {
              token: "fake-jwt-token-demo-2025",
              user: {
                name: "Shakirat Ogunlesi",
                email: "shaki_ogunlesi@outlook.com",
                avatar: "/images/Avatars.png",
                role: "admin"
              }
            }
          }
        }

        return {
          error: {
            status: 401,
            data: "Invalid email or password"
          }
        }
      },
    }),

    getProfile: builder.query<UserProfile, void>({
      providesTags: ['User'],
      async queryFn() {
        await new Promise(r => setTimeout(r, 400))
        return {
          data: {
            name: "Shakirat Ogunlesi",
            email: "shaki_ogunlesi@outlook.com",
            avatar: "/images/Avatars.png",
            role: "admin"
          }
        }
      },
    }),


    getCourses: builder.query<Course[], void>({
      providesTags: ['Courses'],
      async queryFn() {
        await new Promise(r => setTimeout(r, 700))

        return {
          data: [
            {
                id: "1",
                title: "Effective Workplace Communication",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Soft Skill",
                image: "/images/course1.png",
            },
            {
                id: "2",
                title: "Mastering Interpersonal Skills",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Compliance & Policy",
                image: "/images/course2.png",
            },
            {
                id: "3",
                title: "Strengthening Team Cohesion",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Soft Skill",
                image: "/images/course3.png",
            },
            {
                id: "4",
                title: "Enhancing Team Dialogue",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Digital Skills",
                image: "/images/course4.png",
            },
            {
                id: "5",
                title: "Optimizing Group Dynamics",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Business & Strategy",
                image: "/images/course5.png",
            },
            {
                id: "6",
                title: "Cultivating Open Communication",
                description: "Upon completion of this module, participants will: Implement practical communication techniques, a...",
                category: "Onboarding",
                image: "/images/course6.png",
            },
          ]
        }
      },
    }),

    // ── COURSE DETAIL + LEARNING PAGE DATA ─────────────────────────

    getCourseDetail: builder.query<
      {
        course: Course
        learners: Learner[]
        sections: Section[]
      },
      string // courseId
    >({
      providesTags: (result, error, courseId) => [
        { type: 'CourseDetail', id: courseId }
      ],

      async queryFn(courseId) {
        await new Promise(r => setTimeout(r, 900))

        // For now we only have full data for course "1"
        if (courseId !== "1") {
          return {
            error: { status: 404, data: "Course not found" }
          }
        }

        return {
          data: {
            course: {
              id: "1",
              title: "Effective Workplace Communication",
              description: "...",
              category: "Soft Skill",
              image: "/images/course1.png"
            },
            learners: [
                { id: "1",  name: "Nithya Menon",        city: "New York", email: "nithya.menon@email.com",          avatar: "/images/Avatar1.png" },
                { id: "2",  name: "Meera Gonzalez",      city: "Toronto",  email: "meera.gonzalez@email.com",        avatar: "/images/Avatar2.png" },
                { id: "3",  name: "Monica Patel",        city: "Paris",    email: "monica.patel@email.com",          avatar: "/images/Avatar3.png" },
                { id: "4",  name: "Dinesh Kumar",        city: "Tokyo",    email: "dinesh.kumar@email.com",          avatar: "/images/Avatar4.png" },
                { id: "5",  name: "Karthik Subramanian", city: "London",   email: "karthik.subramanian@email.com",   avatar: "/images/Avatar5.png" },
                { id: "6",  name: "Monica Patel",        city: "Paris",    email: "jagathesh.narayanan@email.com",   avatar: "/images/Avatar6.png" },
                { id: "7",  name: "Jagathesh Narayanan", city: "Berlin",   email: "jagathesh.narayanan@email.com",   avatar: "/images/Avatar7.png" },
                { id: "8",  name: "Monica Patel",        city: "Paris",    email: "monica.patel@email.com",          avatar: "/images/Avatar8.png" },
                { id: "9",  name: "Nithya Menon",        city: "New York", email: "nithya.menon@email.com",          avatar: "/images/Avatar9.png" },
                { id: "10", name: "Jagathesh Narayanan", city: "Tokyo",    email: "dinesh.kumar@email.com",          avatar: "" },
            ],
            sections: [
              {
                id: "introduction",
                title: "Introduction",
                defaultOpen: true,
                lessons: [
                { id: "1-1", title: "Welcome Message" },
                { id: "1-2", title: "A Note on Style" },
                { id: "1-3", title: "What You'll Learn" },
                { id: "1-4", title: "Meet Your Instructor" },
                ],
            },
            { id: "setup", title: "Setting Up Your Workspace", lessons: [] },
            { id: "navigating", title: "Navigating the Course", lessons: [] },
            { id: "resources", title: "Course Resources", lessons: [] },
            {
                id: "assessment",
                title: "Assessment",
                lessons: [{ id: "5-quiz", title: "Quiz", type: "quiz" }],
            },
            ]
          }
        }
      }
    }),

    // ── PROGRESS / LEARNING STATE ──────────────────────────────────
    // (you can store this in localStorage or later in backend)

    getCourseProgress: builder.query<
      {
        completedLessons: string[]      
        quizSubmitted: boolean
      },
      string // courseId
    >({
      providesTags: (result, error, courseId) => [
        { type: 'Progress', id: courseId }
      ],

      async queryFn(courseId) {
        // Later: read from localStorage or API
        await new Promise(r => setTimeout(r, 300))
        return {
          data: {
            completedLessons: [],
            quizSubmitted: false
          }
        }
      }
    }),

    markLessonComplete: builder.mutation<null, { courseId: string; lessonId: string }>({
      invalidatesTags: (result, error, arg) => [
        { type: 'Progress', id: arg.courseId }
      ],

      async queryFn({ lessonId }) {
        console.log("Lesson marked complete:", lessonId)
        
       return { data: null }
      }
    }),

    submitQuiz: builder.mutation<
      { score: number; passed: boolean },
      { courseId: string; answers: Record<string, string | string[]> }
    >({
      invalidatesTags: (result, error, arg) => [
        { type: 'Progress', id: arg.courseId },
        { type: 'CourseDetail', id: arg.courseId }
      ],

      async queryFn({ answers }) {
        await new Promise(r => setTimeout(r, 1400))

        // Very naive example scoring – improve later
        const totalPoints = 40 // sum of all question points
        const achieved = Math.floor(Math.random() * totalPoints * 0.8) + 10

        return {
          data: {
            score: achieved,
            passed: achieved >= 28
          }
        }
      }
    }),
  }),
})

export const {
  useLoginMutation,
  useGetProfileQuery,
  useGetCoursesQuery,
  useGetCourseDetailQuery,
  useGetCourseProgressQuery,
  useMarkLessonCompleteMutation,
  useSubmitQuizMutation,
} = apiSlice