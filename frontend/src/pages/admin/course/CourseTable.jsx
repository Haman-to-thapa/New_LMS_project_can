import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import { useGetCeatorCourseQuery } from '@/featureSlice/api/courseApi'
import { Edit, Plus, Search, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Loading skeleton for the table
const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-10 w-[150px]" />
    </div>
    <div className="border rounded-md">
      <div className="h-12 border-b px-6 flex items-center">
        <Skeleton className="h-4 w-full" />
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-16 border-b px-6 flex items-center">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ onCreateClick }) => (
  <Card className="w-full text-center">
    <CardHeader>
      <CardTitle>No Courses Found</CardTitle>
      <CardDescription>You haven't created any courses yet.</CardDescription>
    </CardHeader>
    <CardContent className="pb-6">
      <Button onClick={onCreateClick} className="mt-2">
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Course
      </Button>
    </CardContent>
  </Card>
);

const CourseTable = () => {
  const { data, isLoading, isError, error } = useGetCeatorCourseQuery()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on search query
  const filteredCourses = data?.courses?.filter(course =>
    course.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle loading state
  if (isLoading) {
    return <TableSkeleton />
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading courses: {error?.data?.message || "Something went wrong"}</p>
        <Button onClick={() => navigate('create')}>Create New Course</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <h2 className="text-2xl font-bold">Your Courses</h2>
        <Button onClick={() => navigate('create')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState onCreateClick={() => navigate('create')} />
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>A list of your recent courses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>₹{course?.coursePrice || "NA"}</TableCell>
                  <TableCell>
                    <Badge className={course.isPublished ? "bg-green-500" : "bg-yellow-500"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{course.courseTitle}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size='sm'
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                      title="Edit Course"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default CourseTable