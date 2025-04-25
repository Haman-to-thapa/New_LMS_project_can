/**
 * Mock data for development when MongoDB is unavailable
 * This file contains sample data that will be loaded into the in-memory database
 */

export const mockUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$rrCvVeuU6GYKjL7.WCgKz.Jl2.QE1CCxGy.Xjox6lJZQY1rZhQGOq", // "password123"
    role: "admin",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    enrolledCourse: ["mock_1", "mock_2"]
  },
  {
    name: "Student User",
    email: "student@example.com",
    password: "$2a$10$rrCvVeuU6GYKjL7.WCgKz.Jl2.QE1CCxGy.Xjox6lJZQY1rZhQGOq", // "password123"
    role: "student",
    photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    enrolledCourse: ["mock_1"]
  },
  {
    name: "Instructor User",
    email: "instructor@example.com",
    password: "$2a$10$rrCvVeuU6GYKjL7.WCgKz.Jl2.QE1CCxGy.Xjox6lJZQY1rZhQGOq", // "password123"
    role: "instructor",
    photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    enrolledCourse: []
  }
];

export const mockCourses = [
  {
    courseTitle: "React Masterclass",
    subTitle: "Learn React from the ground up",
    description: "A comprehensive course on React, covering everything from basics to advanced concepts.",
    category: "Web Development",
    courseLevel: "Intermediate",
    coursePrice: 1999,
    courseThumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
    isPublished: true,
    creator: "mock_3", // Instructor User
    lectures: ["mock_1", "mock_2"],
    enrolledStudents: ["mock_1", "mock_2"] // Admin and Student
  },
  {
    courseTitle: "Node.js for Beginners",
    subTitle: "Build server-side applications with JavaScript",
    description: "Learn how to use Node.js to build scalable backend applications.",
    category: "Backend",
    courseLevel: "Beginner",
    coursePrice: 1499,
    courseThumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop",
    isPublished: true,
    creator: "mock_3", // Instructor User
    lectures: ["mock_3", "mock_4"],
    enrolledStudents: ["mock_1"] // Admin only
  },
  {
    courseTitle: "Full Stack Development",
    subTitle: "Master both frontend and backend",
    description: "Become a full stack developer with this comprehensive course on the MERN stack.",
    category: "Web Development",
    courseLevel: "Advanced",
    coursePrice: 2499,
    courseThumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop",
    isPublished: false, // Draft course
    creator: "mock_3", // Instructor User
    lectures: [],
    enrolledStudents: []
  }
];

export const mockLectures = [
  {
    lectureTitle: "Introduction to React",
    description: "Learn the basics of React and its core concepts",
    videoUrl: "https://example.com/video1.mp4",
    isPreviewFree: true,
    courseId: "mock_1" // React Masterclass
  },
  {
    lectureTitle: "Components and Props",
    description: "Understanding React components and how to pass data with props",
    videoUrl: "https://example.com/video2.mp4",
    isPreviewFree: false,
    courseId: "mock_1" // React Masterclass
  },
  {
    lectureTitle: "Getting Started with Node.js",
    description: "Setting up your development environment",
    videoUrl: "https://example.com/video3.mp4",
    isPreviewFree: true,
    courseId: "mock_2" // Node.js for Beginners
  },
  {
    lectureTitle: "Building a REST API",
    description: "Learn how to create RESTful APIs with Express",
    videoUrl: "https://example.com/video4.mp4",
    isPreviewFree: false,
    courseId: "mock_2" // Node.js for Beginners
  }
];

export const mockPurchases = [
  {
    courseId: "mock_1", // React Masterclass
    userId: "mock_1", // Admin User
    amount: 1999,
    status: "completed",
    paymentId: "mock_payment_1"
  },
  {
    courseId: "mock_1", // React Masterclass
    userId: "mock_2", // Student User
    amount: 1999,
    status: "completed",
    paymentId: "mock_payment_2"
  },
  {
    courseId: "mock_2", // Node.js for Beginners
    userId: "mock_1", // Admin User
    amount: 1499,
    status: "completed",
    paymentId: "mock_payment_3"
  }
];
