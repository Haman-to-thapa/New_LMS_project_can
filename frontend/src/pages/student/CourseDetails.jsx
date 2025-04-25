import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useGetCourseDetailStatusQuery } from '@/featureSlice/api/purchaseApi'
import {
  BadgeInfo,
  Lock,
  PlayCircle,
  Calendar,
  Users,
  Star,
  Clock,
  CheckCircle2,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'
import BuyCurseButton from '@/components/BuyCurseButton'

const CourseDetails = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, isError } = useGetCourseDetailStatusQuery(courseId);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (isError || !data) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">Failed to load course details</h1>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Try Again
      </Button>
    </div>
  );

  const { course, purchased } = data;

  // Calculate lecture count
  const lectureCount = course.lectures?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-white text-blue-700">{course.courseLevel || "Beginner"}</Badge>
                <Badge className="bg-green-500">{purchased ? "Enrolled" : "Available"}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.courseTitle || "Course Title"}</h1>

              <p className="text-lg opacity-90">
                Master the skills that will drive your career forward with this comprehensive course
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Updated {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "Recently"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course?.enrolledStudents?.length || 0} students enrolled</span>
                </div>

                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" />
                  <span>4.8 (120 ratings)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{lectureCount * 15} mins total</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <img
                    src={course?.creator?.photoUrl || "https://ui-avatars.com/api/?name=Instructor"}
                    alt={course?.creator?.name || "Instructor"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-blue-300">{course?.creator?.name || "Instructor"}</p>
                </div>
              </div>
            </div>

            <div className="lg:ml-auto">
              <Card className="w-full max-w-md mx-auto shadow-xl">
                <CardContent className="p-0 overflow-hidden">
                  <div className="relative aspect-video">
                    {course.lectures && course.lectures.length > 0 && course.lectures[0].videoUrl ? (
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        url={course.lectures[0].videoUrl}
                        controls={true}
                        light={course.courseThumbnail}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                        <div className="text-center p-4">
                          <BookOpen className="mx-auto h-12 w-12 mb-2" />
                          <p>Preview not available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold">₹{course.coursePrice || 0}</span>
                      {course.originalPrice && (
                        <span className="text-gray-400 line-through">₹{course.originalPrice}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span>{lectureCount} lectures</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>

                    {purchased ? (
                      <Button
                        onClick={() => navigate(`/course-progress/${courseId}`)}
                        className="w-full bg-green-600 hover:bg-green-700">
                        Continue Learning
                      </Button>
                    ) : (
                      <BuyCurseButton courseId={courseId} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 font-medium ${activeTab === 'curriculum' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Reviews
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: course.description || '<p>No description available</p>' }} />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Build real-world applications",
                    "Understand core concepts",
                    "Implement best practices",
                    "Develop problem-solving skills",
                    "Create responsive designs",
                    "Master modern techniques"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Course Includes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen size={18} />
                      Lectures
                    </span>
                    <span>{lectureCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Clock size={18} />
                      Total Duration
                    </span>
                    <span>{lectureCount * 15} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users size={18} />
                      Students
                    </span>
                    <span>{course?.enrolledStudents?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      Last Updated
                    </span>
                    <span>{course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "Recently"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <p className="mb-4">{lectureCount} lectures • {lectureCount * 15} min total length</p>

            <Card className="overflow-hidden">
              <div className="divide-y">
                {course.lectures && course.lectures.length > 0 ? (
                  course.lectures.map((lecture, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {purchased || lecture.isPreviewFree ? (
                            <PlayCircle size={20} className="text-green-500" />
                          ) : (
                            <Lock size={20} className="text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">{lecture.lectureTitle}</p>
                            <p className="text-sm text-gray-500">15 min</p>
                          </div>
                        </div>
                        {purchased || lecture.isPreviewFree ? (
                          <Button variant="ghost" size="sm">
                            Watch
                          </Button>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No lectures available for this course yet.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold">4.8</div>
                <div className="flex text-yellow-400 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} fill="currentColor" size={16} />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">Course Rating</div>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <div className="w-10 text-right">{rating} stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 5 : 0}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-left text-sm text-gray-500">
                      {rating === 5 ? '75%' : rating === 4 ? '20%' : rating === 3 ? '5%' : '0%'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-center text-gray-500">No reviews yet. Be the first to review this course!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetails
