import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Award,
  GraduationCap
} from 'lucide-react'
import { useGetCeatorCourseQuery } from '@/featureSlice/api/courseApi'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ icon, title, value, description, trend, color }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-1.5 sm:p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="p-2 pt-0">
          <div className={`flex items-center text-xs ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1 transform rotate-180" />}
            <span>{trend.value}% {trend.isUp ? 'increase' : 'decrease'}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

const RecentActivity = ({ activities }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-md">
      <CardHeader className="p-4">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your latest course activities</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0">
              <div className={`p-1.5 sm:p-2 rounded-full ${activity.iconBg} hidden sm:block`}>
                {activity.icon}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-0">
                  <div className={`p-1.5 rounded-full ${activity.iconBg} sm:hidden mr-2`}>
                    {activity.icon}
                  </div>
                  <p className="font-medium text-sm sm:text-base truncate">{activity.title}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground sm:ml-auto sm:pl-2 mt-1 sm:mt-0">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          View all activities
        </Button>
      </CardFooter>
    </Card>
  )
}

const PopularCourses = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-md">
      <CardHeader className="p-4">
        <CardTitle className="text-lg sm:text-xl">Popular Courses</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your most enrolled courses</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1964&auto=format&fit=crop"}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{course.title}</p>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Users size={12} className="sm:hidden" />
                  <Users size={14} className="hidden sm:block" />
                  <span>{course.students} students</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium pl-1">₹{course.price}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/course')}
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          View all courses
        </Button>
      </CardFooter>
    </Card>
  )
}

const Dashboard = () => {
  const { data, isLoading } = useGetCeatorCourseQuery();
  const navigate = useNavigate();

  // Calculate statistics from data
  const totalCourses = data?.courses?.length || 0;
  const publishedCourses = data?.courses?.filter(course => course.isPublished).length || 0;
  const totalStudents = data?.courses?.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0) || 0;
  const totalRevenue = data?.courses?.reduce((acc, course) => {
    const enrolledCount = course.enrolledStudents?.length || 0;
    return acc + (enrolledCount * course.coursePrice);
  }, 0) || 0;

  // Sample recent activities
  const recentActivities = [
    {
      icon: <Users size={16} className="text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "New student enrolled",
      description: "A new student enrolled in React Masterclass",
      time: "2 hours ago"
    },
    {
      icon: <BookOpen size={16} className="text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-900",
      title: "Course published",
      description: "You published a new course: Advanced JavaScript",
      time: "1 day ago"
    },
    {
      icon: <DollarSign size={16} className="text-yellow-500" />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900",
      title: "Payment received",
      description: "You received payment for Node.js Course",
      time: "2 days ago"
    },
    {
      icon: <Award size={16} className="text-purple-500" />,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      title: "Course completed",
      description: "A student completed the Full Stack Development course",
      time: "3 days ago"
    }
  ];

  // Sample popular courses
  const popularCourses = data?.courses?.slice(0, 3).map(course => ({
    id: course._id,
    title: course.courseTitle,
    thumbnail: course.courseThumbnail,
    students: course.enrolledStudents?.length || 0,
    price: course.coursePrice
  })) || [
      {
        id: "1",
        title: "React Masterclass",
        thumbnail: null,
        students: 120,
        price: 1999
      },
      {
        id: "2",
        title: "Node.js for Beginners",
        thumbnail: null,
        students: 85,
        price: 1499
      },
      {
        id: "3",
        title: "Full Stack Development",
        thumbnail: null,
        students: 65,
        price: 2499
      }
    ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button
          onClick={() => navigate('/admin/course/create')}
          className="w-full sm:w-auto"
        >
          Create New Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<BookOpen size={18} className="text-white" />}
          title="Total Courses"
          value={totalCourses}
          description="Total courses created"
          color="bg-blue-500"
          trend={{ isUp: true, value: 12 }}
        />
        <StatCard
          icon={<GraduationCap size={18} className="text-white" />}
          title="Published Courses"
          value={publishedCourses}
          description="Courses available to students"
          color="bg-green-500"
          trend={{ isUp: true, value: 8 }}
        />
        <StatCard
          icon={<Users size={18} className="text-white" />}
          title="Total Students"
          value={totalStudents}
          description="Students enrolled in your courses"
          color="bg-purple-500"
          trend={{ isUp: true, value: 24 }}
        />
        <StatCard
          icon={<DollarSign size={18} className="text-white" />}
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          description="Total earnings from courses"
          color="bg-yellow-500"
          trend={{ isUp: true, value: 18 }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentActivity activities={recentActivities} />
        <PopularCourses courses={popularCourses} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card
          className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/course/create')}
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <BookOpen size={20} className="mb-2 text-blue-500" />
            <h3 className="font-medium text-sm sm:text-base">Create Course</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Add a new course</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <BarChart3 size={20} className="mb-2 text-green-500" />
            <h3 className="font-medium text-sm sm:text-base">View Analytics</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Check performance</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <Calendar size={20} className="mb-2 text-purple-500" />
            <h3 className="font-medium text-sm sm:text-base">Schedule Class</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Plan sessions</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <Users size={20} className="mb-2 text-yellow-500" />
            <h3 className="font-medium text-sm sm:text-base">Manage Students</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">View students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard