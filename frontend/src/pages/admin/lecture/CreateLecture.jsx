import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/featureSlice/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {

  const [lectureTitle, setLectureTitle] = useState("")

  const navigate = useNavigate()
  const param = useParams()
  const courseId = param.courseId;

  const [createLecture, { data, isSuccess, isLoading, error }] = useCreateLectureMutation()

  // const { data: lectureData, isLoading: lectureIsLoading, isError: lectureError } = useGetCourseLectureQuery()

  const { data: lectureData, isLoading: lectureIsLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId)


  const createLectureHandler = async () => {
    // Validate input
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      await createLecture({ lectureTitle, courseId });
      // Clear the input field after successful creation
      setLectureTitle("");
    } catch (err) {
      console.error("Error creating lecture:", err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "lecture updated successfully")
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }
  }, [isSuccess, error, data])


  return (
    <div className="flex-1 mx-10 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-bold text-2xl text-gray-700">
          Let's Add a Lecture, add some basic details for your new Lecture
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          It typically includes engaging lectures, hands-on exercises, and real-world examples to enhance understanding.
        </p>
      </div>
      <div className="space-y-6 mt-4">
        <div className="">
          <Label>Title</Label>
          <Input type="text"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Course Name" />
        </div>

        <div className="flex items-center gap-x-5">
          <Button variant='outline' className='hover:bg-red-600 hover:text-white' onClick={() => navigate(`/admin/course/${courseId}`)} >Back to Course</Button>
          <Button
            onClick={createLectureHandler}
            className="hover:bg-blue-600 hover:text-white"
            disabled={isLoading}

          >
            {
              isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </> : "Create Lecture"
            }
          </Button>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Lecture List</h2>
          {
            lectureIsLoading ? (
              <div className="p-4 border rounded-md">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            ) : lectureError ? (
              <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-md text-red-600 dark:text-red-400">
                <p>Failed to load lectures. Please try again.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : !lectureData || !Array.isArray(lectureData.lectures) ? (
              <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-600 dark:text-yellow-400">
                <p>No lecture data available. Try refreshing the page.</p>
              </div>
            ) : lectureData.lectures.length === 0 ? (
              <div className="p-4 border rounded-md text-center">
                <p className="text-muted-foreground">No lectures available yet. Create your first lecture above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lectureData.lectures.map((lecture, index) => (
                  <Lecture
                    key={lecture?._id || index}
                    index={index}
                    lecture={lecture}
                    courseId={courseId}
                    onSuccess={() => refetch()}
                  />
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
