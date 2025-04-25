import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CourseTab from './CourseTab'
import { ArrowRight } from 'lucide-react'


const EditCourse = () => {

  const { courseId } = useParams()


  return (
    <div className='flex-1 '>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to={`/admin/course/${courseId}/lecture`} className='flex items-center'>
          <ArrowRight size={24} className='font-semibold' />
          <Button
            className="hover:scale-105 text-blue-600 hover:underline" variant='link'>Go to Lecture</Button>
        </Link>
      </div>
      <CourseTab />

    </div>
  )
}

export default EditCourse
