import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/featureSlice/api/courseApi";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { isLoading, isSuccess, error, data }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  // Handle success and error states
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully");
      navigate(`/admin/course/${data?.course?._id}`);
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create course");
    }
  }, [isSuccess, error, data, navigate]);

  const createCourseHandler = async () => {
    // Validate inputs
    if (!courseTitle.trim()) {
      return toast.error("Course title is required");
    }
    if (!category) {
      return toast.error("Category is required");
    }

    try {
      await createCourse({ courseTitle, category });
    } catch (err) {
      console.error("Error creating course:", err);
    }
  }

  return (
    <div className="flex-1 mx-10 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-bold text-2xl text-gray-700">
          Let's Add a Course
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          A well-structured course provides learners with the knowledge and skills they need to succeed in a particular field.
          It typically includes engaging lectures, hands-on exercises, and real-world examples to enhance understanding.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Whether beginner-friendly or advanced, a course is designed to help students progress step by step, ensuring a smooth learning experience.
          With clear objectives, expert guidance, and interactive content, a great course keeps learners motivated and helps them achieve their goals efficiently.
        </p>
      </div>
      <div className="space-y-6 mt-4">
        <div className="">
          <Label>Title</Label>
          <Input type="text"
            name="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name" />
        </div>
        <div className="">
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Css">Css</SelectItem>
                <SelectItem value="Tailwind">Tailwind</SelectItem>
                <SelectItem value="Github<">Github</SelectItem>
                <SelectItem value="Next js">Next js</SelectItem>
                <SelectItem value="React js">React js</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="Frontend Developers">Frontend Developer</SelectItem>
                <SelectItem value="Github">Github</SelectItem>

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-x-5">
          <Button variant='outline' className='hover:bg-red-600 hover:text-white' onClick={() => navigate('/admin/course')}>Back</Button>
          <Button className="hover:bg-blue-600 hover:text-white"
            disabled={isLoading}
            onClick={createCourseHandler}
          >
            {
              isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </> : "Create"
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;