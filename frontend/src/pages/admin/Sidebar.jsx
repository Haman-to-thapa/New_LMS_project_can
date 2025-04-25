import { ChartNoAxesColumn, SquareLibrary, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Sidebar = () => {
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const navLinks = [
    {
      path: '/admin/dashboard',
      icon: <ChartNoAxesColumn size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/admin/course',
      icon: <SquareLibrary size={20} />,
      label: 'Course'
    }
  ]

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Mobile Sidebar Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileSidebar}
      >
        {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "lg:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          "fixed lg:sticky top-0 z-40 h-screen transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                  location.pathname.startsWith(link.path)
                    ? "bg-blue-500 text-white font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <Outlet />
      </div>
    </div>
  )
}

export default Sidebar