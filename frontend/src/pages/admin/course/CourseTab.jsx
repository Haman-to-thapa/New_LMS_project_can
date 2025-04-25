
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InfinityLoader from '@/components/ui/LoadingSpinner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation
} from '@/featureSlice/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumnail] = useState('');
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  // api RTK
  const [editCourse, { isLoading, data, isSuccess, error }] = useEditCourseMutation()
  const params = useParams()
  const courseId = params.courseId;
  console.log("Course ID:", courseId);

  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true })

  const [publishCourse] = usePublishCourseMutation();
  const [removeCourse, { isLoading: isRemoving }] = useRemoveCourseMutation();

  useEffect(() => {
    if (courseByIdData?.course) {
      setInput({
        courseTitle: courseByIdData.course.courseTitle,
        subTitle: courseByIdData.course.subTitle,
        description: courseByIdData.course.description,
        category: courseByIdData.course.category,
        courseLevel: courseByIdData.course.courseLevel,
        coursePrice: courseByIdData.course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]); // Make sure this effect runs when `courseByIdData` changes



  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {

    console.log(input)
    // RTa added
    const formData = new FormData()
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description)
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice),
      formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId })
  };

  //RTa
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course update")
    }
    if (error) {
      toast.error(error.data.message || 'Failed to update course')
    }
  }, [isSuccess, error])

  const removeCourseHandler = async () => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await removeCourse(courseId).unwrap();
      toast.success(response?.message || "Course deleted successfully");
      navigate('/admin/course'); // Redirect to courses list
    } catch (error) {
      console.error("Error removing course:", error);

      // Check if it's a connection error (server not running)
      if (error.status === 'FETCH_ERROR' || error.error === 'TypeError: Failed to fetch') {
        // Handle connection error gracefully
        toast.error("Cannot connect to server. Please make sure your backend is running.");

        // Optional: You can still navigate back to the course list
        // This gives the user a way to get out of the current page even if the delete failed
        if (window.confirm("Server connection failed. Do you want to go back to the course list?")) {
          navigate('/admin/course');
        }
      } else {
        // Handle other types of errors
        toast.error(error?.data?.message || "Failed to delete course");
      }
    }
  };


  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action }).unwrap();
      refetch(); // Always refetch to get the latest data

      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success(action === "true" ? "Course published successfully" : "Course unpublished successfully");
      }
    } catch (error) {
      console.error("Publish status error:", error);
      toast.error(error?.data?.message || "Failed to update course status");
    }
  };



  if (courseByIdLoading) return <InfinityLoader />


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>Make changes to your courses here. Click save when you're done.</CardDescription>
        </div>
        <div className="space-x-2.5 flex">
          <Button
            variant="outline"
            onClick={() => publishStatusHandler(courseByIdData?.course?.isPublished ? "false" : "true")}
          >
            {courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button
            onClick={removeCourseHandler}
            disabled={isRemoving}
            variant="destructive"
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              'Remove Course'
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input type="text" name="courseTitle" placeholder="Ex. FullStack developer" value={input.courseTitle} onChange={changeEventHandler} />
          </div>
          <div>
            <Label>SubTitle</Label>
            <Input type="text" placeholder="Ex. Become a FullStack developer from hero to hero" name="subTitle" onChange={changeEventHandler} value={input.subTitle} />
          </div>


          <div>
            <Label>Description</Label>
            <textarea
              rows={4}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write a detailed description of your course..."
              name='description'
              onChange={changeEventHandler}
              value={input.description}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-full sm:w-auto">
              <Label>Category</Label>
              <Select onValueChange={selectCategory} defaultValue={input.category || ""}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="Tailwind">Tailwind</SelectItem>
                    <SelectItem value="Github">Github</SelectItem>
                    <SelectItem value="Next.js">Next.js</SelectItem>
                    <SelectItem value="React.js">React.js</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel} defaultValue={input.courseLevel || ""}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Label>Course Price</Label>
              <Input type="number" placeholder="199" name="coursePrice" onChange={changeEventHandler} value={input.coursePrice} />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input type="file" accept="image/*" className="w-fit" onChange={selectThumbnail} />
            {previewThumbnail && <img src={previewThumbnail} className="w-64 my-2" alt="Course Thumbnail" />}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin/course')}>Cancel</Button>
            <Button disabled={isLoading} className="flex items-center" onClick={updateCourseHandler}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "SAVE"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
