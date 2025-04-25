import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/featureSlice/api/courseApi';

// Define CoursSkeleton
const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden animate-pulse">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

// raw data
// const coursess = [1, 2, 3, 4, 5, 6, 7, 8]

const Courses = () => {

  const { data, isLoading, isError } = useGetPublishedCourseQuery()

  if (isError) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold text-red-500 mb-4">Failed to load courses</h1>
        <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    )
  }

  return (
    <div id="courses-section" className='bg-gray-100 dark:bg-gray-900 py-12'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className='font-bold text-3xl text-center mb-10'>Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {
            isLoading ? Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            )) :
              (
                Array.isArray(data?.courses) && data.courses.length > 0 ? (
                  data.courses.map((course, index) => (
                    <Course key={course._id || index} course={course} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No courses available</h3>
                    <p className="text-muted-foreground">Check back later for new courses</p>
                  </div>
                )

              )


          }

        </div>

      </div>
    </div>
  )
}

export default Courses


