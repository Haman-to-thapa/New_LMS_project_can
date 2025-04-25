// Mock data for development when MongoDB is unavailable
export const mockCourses = [
  {
    _id: "mock-course-1",
    courseTitle: "React Masterclass",
    courseDescription: "Learn React from the ground up and build modern web applications",
    coursePrice: 1999,
    courseThumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
    courseCategory: "Web Development",
    courseLevel: "Intermediate",
    isPublished: true,
    creator: {
      _id: "mock-user-1",
      name: "John Doe",
      email: "john@example.com",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    lectures: [
      {
        _id: "mock-lecture-1",
        lectureTitle: "Introduction to React",
        description: "Learn the basics of React and its core concepts",
        videoUrl: "https://example.com/video1.mp4",
        isPreviewFree: true
      },
      {
        _id: "mock-lecture-2",
        lectureTitle: "Components and Props",
        description: "Understanding React components and how to pass data with props",
        videoUrl: "https://example.com/video2.mp4",
        isPreviewFree: false
      }
    ],
    enrolledStudents: ["mock-user-2", "mock-user-3"]
  },
  {
    _id: "mock-course-2",
    courseTitle: "Node.js for Beginners",
    courseDescription: "Build server-side applications with JavaScript using Node.js",
    coursePrice: 1499,
    courseThumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop",
    courseCategory: "Backend",
    courseLevel: "Beginner",
    isPublished: true,
    creator: {
      _id: "mock-user-1",
      name: "John Doe",
      email: "john@example.com",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    lectures: [
      {
        _id: "mock-lecture-3",
        lectureTitle: "Getting Started with Node.js",
        description: "Setting up your development environment",
        videoUrl: "https://example.com/video3.mp4",
        isPreviewFree: true
      },
      {
        _id: "mock-lecture-4",
        lectureTitle: "Building a REST API",
        description: "Learn how to create RESTful APIs with Express",
        videoUrl: "https://example.com/video4.mp4",
        isPreviewFree: false
      }
    ],
    enrolledStudents: ["mock-user-3"]
  },
  {
    _id: "mock-course-3",
    courseTitle: "Full Stack Development",
    courseDescription: "Master both frontend and backend development with the MERN stack",
    coursePrice: 2499,
    courseThumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop",
    courseCategory: "Web Development",
    courseLevel: "Advanced",
    isPublished: true,
    creator: {
      _id: "mock-user-1",
      name: "John Doe",
      email: "john@example.com",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    lectures: [
      {
        _id: "mock-lecture-5",
        lectureTitle: "Introduction to MERN Stack",
        description: "Overview of MongoDB, Express, React, and Node.js",
        videoUrl: "https://example.com/video5.mp4",
        isPreviewFree: true
      },
      {
        _id: "mock-lecture-6",
        lectureTitle: "Building a Full Stack Application",
        description: "Step-by-step guide to creating a complete web application",
        videoUrl: "https://example.com/video6.mp4",
        isPreviewFree: false
      }
    ],
    enrolledStudents: []
  }
];

export const mockUser = {
  _id: "mock-user-1",
  name: "John Doe",
  email: "john@example.com",
  photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  role: "instructor",
  enrolledCourse: ["mock-course-2"]
};

export const mockPurchases = [
  {
    _id: "mock-purchase-1",
    courseId: {
      _id: "mock-course-2",
      courseTitle: "Node.js for Beginners",
      courseThumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop",
      coursePrice: 1499
    },
    userId: "mock-user-1",
    amount: 1499,
    status: "completed",
    paymentId: "mock-payment-1"
  }
];
