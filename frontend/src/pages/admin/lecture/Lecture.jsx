import { Edit, Trash2 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRemoveLectureMutation } from '@/featureSlice/api/courseApi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const Lecture = ({ lecture, courseId, index, onSuccess }) => {
  const navigate = useNavigate()
  const [removeLecture, { isLoading: isRemoving }] = useRemoveLectureMutation()

  const goToUpdateLecture = () => {
    if (!lecture?._id) {
      toast.error("Lecture ID is missing");
      return;
    }
    navigate(`${lecture._id}`)
  }

  const handleRemoveLecture = async () => {
    if (!lecture?._id || !courseId) {
      toast.error("Missing required information");
      return;
    }

    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      await removeLecture({
        lectureId: lecture._id,
        courseId
      }).unwrap();

      toast.success("Lecture removed successfully");

      // Call the onSuccess callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error("Error removing lecture:", error);
      toast.error(error?.data?.message || "Failed to remove lecture");
    }
  }


  return (
    <div className='flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-3 my-2 rounded-md border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow'>
      <div>
        <h1 className='font-bold text-gray-800 dark:text-gray-100'>
          Lecture {index + 1}: {lecture?.lectureTitle || "Untitled Lecture"}
        </h1>
        {lecture?.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {lecture.description}
          </p>
        )}
      </div>
      <div className='flex gap-2'>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToUpdateLecture}
          title="Edit Lecture"
        >
          <Edit size={18} className='text-blue-600 dark:text-blue-400' />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveLecture}
          disabled={isRemoving}
          title="Delete Lecture"
        >
          <Trash2 size={18} className='text-red-600 dark:text-red-400' />
        </Button>
      </div>
    </div>
  )
}

export default Lecture
