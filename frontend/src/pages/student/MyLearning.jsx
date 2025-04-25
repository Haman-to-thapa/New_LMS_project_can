import React, { useState } from "react";
import Course from "./Course";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  Search,
  Filter,
  CheckCircle2,
  BarChart3,
  BookMarked,
  PlayCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <div className="h-40 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <CardContent className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-300" />
    </div>
    <h3 className="text-lg font-medium mb-2">No courses yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
    </p>
    <Button>Browse Courses</Button>
  </div>
);

const CourseCard = ({ course, progress }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1964&auto=format&fit=crop"}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge className="bg-blue-500">{course.category}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookMarked size={14} />
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate(`/course-detail/${course.id}`)}
        >
          <BookOpen size={14} />
          <span>Details</span>
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate(`/course-progress/${course.id}`)}
        >
          <PlayCircle size={14} />
          <span>Continue</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

const CertificateCard = ({ certificate }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
        <Award className="h-16 w-16 text-white" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{certificate.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">Completed on {certificate.date}</p>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 size={14} className="text-green-500" />
          <span>{certificate.course}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Certificate
        </Button>
      </CardFooter>
    </Card>
  );
};

const MyLearning = () => {
  const [activeTab, setActiveTab] = useState("in-progress");
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = false;

  // Sample data - replace with actual API data
  const allCourses = [
    {
      id: "1",
      title: "React Fundamentals",
      description: "Learn the basics of React including components, props, and state management",
      thumbnail: null,
      category: "Web Development",
      duration: "5h 30m",
      lessons: 12,
      progress: 65
    },
    {
      id: "2",
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into closures, prototypes, async/await and more",
      thumbnail: null,
      category: "Programming",
      duration: "8h 15m",
      lessons: 18,
      progress: 30
    },
    {
      id: "3",
      title: "Node.js for Beginners",
      description: "Build server-side applications with JavaScript",
      thumbnail: null,
      category: "Backend",
      duration: "6h 45m",
      lessons: 15,
      progress: 100
    }
  ];

  const certificates = [
    {
      id: "1",
      title: "Full Stack Web Development",
      date: "Jan 15, 2023",
      course: "MERN Stack Masterclass"
    },
    {
      id: "2",
      title: "JavaScript Expert",
      date: "Mar 22, 2023",
      course: "Advanced JavaScript Concepts"
    }
  ];

  // Filter courses based on search query
  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter courses based on tab
  const inProgressCourses = filteredCourses.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = filteredCourses.filter(course => course.progress === 100);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground">Track your progress and continue learning</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-3">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl mb-1">{allCourses.length}</CardTitle>
            <CardDescription>Total Courses</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl mb-1">{completedCourses.length}</CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mb-3">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-xl mb-1">{inProgressCourses.length}</CardTitle>
            <CardDescription>In Progress</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-3">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-xl mb-1">{certificates.length}</CardTitle>
            <CardDescription>Certificates</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress">
          {isLoading ? (
            <MyLearningSkeleton />
          ) : inProgressCourses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} progress={course.progress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {isLoading ? (
            <MyLearningSkeleton />
          ) : completedCourses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No completed courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Continue learning to complete your courses and earn certificates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <CourseCard key={course.id} course={course} progress={course.progress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates">
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-6">
                Complete courses to earn certificates and showcase your skills.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyLearning;
