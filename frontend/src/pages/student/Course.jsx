import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

const Course = ({ course }) => {
  // Handle case where course is undefined or null
  if (!course) {
    return null;
  }

  return (
    <Link to={`course-detail/${course._id}`}>
      <Card className='overflow-hidden dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'>
        <div className="relative">
          <img
            src={course.courseThumbnail || "https://images.ctfassets.net/23aumh6u8s0i/6pjUKboBuFLvCKkE3esaFA/5f2101d6d2add5c615db5e98a553fc44/nextjs.jpeg"}
            alt={course.courseTitle || "Course thumbnail"}
            className="w-full h-40 object-cover rounded-xl"
          />
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className='hover:underline text-lg font-bold truncate'>{course.courseTitle || "Untitled Course"}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={(course.creator && course.creator.photoUrl) || "https://github.com/shadcn.png"} />
                <AvatarFallback>{(course.creator && course.creator.name && course.creator.name.charAt(0)) || "U"}</AvatarFallback>
              </Avatar>
              <h1 className='font-medium text-sm'>{(course.creator && course.creator.name) || "Instructor"}</h1>
              {course.courseLevel && (
                <Badge className={`bg-blue-600 text-white px-2 py-1 rounded-full text-sm`}>
                  {course.courseLevel}
                </Badge>
              )}
            </div>
          </div>
          <div className='text-lg font-bold'>
            <span>₹{course.coursePrice || 0}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default Course
