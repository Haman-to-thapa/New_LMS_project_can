import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const HeroSection = () => {

  const handleExplore = () => {
    // Scroll to courses section
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='relative bg-gradient-to-r from-blue-500 to-indigo-600
    dark:from-gray-800 dark:to-gray-900
    py-16 px-4 text-center
    '>
      <div className="max-w-3xl mx-auto">
        <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for You</h1>
        <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, Learn and UpSkills with our wide range of courses</p>

        <form action="" className='flex dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto bg-white'>
          <Input type="text"
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 dark:text-gray-100" />
          <Button className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-r-full dark:hover:bg-blue-800 hover:bg-blue-700">Search</Button>
        </form>

        <Button
          onClick={handleExplore}
          className="mt-10 bg-white text-blue-600 hover:bg-indigo-400 hover:scale-105 dark:bg-gray-800 rounded-full"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  )
}

export default HeroSection
