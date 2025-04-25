import Courses from '@/pages/student/Courses'
import HeroSection from '@/pages/student/HeroSection'
import React from 'react'

const LayoutUi = () => {
  return (
    <>
      <HeroSection />

      {/* our courses */}
      <Courses />
    </>
  )
}

export default LayoutUi
