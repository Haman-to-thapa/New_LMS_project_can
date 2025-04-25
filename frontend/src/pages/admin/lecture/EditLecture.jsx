import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {


  const params = useParams();
  const courseId = params.courseId;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-x-10">
          <Link to={`/admin/course/${courseId}/lecture`} className='flex items-center gap-3'>
            <h1 className='text-sm text-blue-400'>Back</h1>
            <Button size="icon" variant="outline" className="rounded-full ">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-blue-500">Update Your Lecture</h1>
        </div>

      </div>
      <LectureTab />
    </div>
  )
}

export default EditLecture