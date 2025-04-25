import { Menu, School } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DarkMode from '@/pages/DarkMode'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '@/featureSlice/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  // Handle logout
  const logoutHandler = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }

  // Handle logout success
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className='h-16 dark:bg-gray-900 bg-white border-b dark:border-b-gray-800 border-b-gray-200
    fixed top-0 left-0 right-0 z-10 w-full'>
      {/* Desktop */}
      <div className="h-full w-full max-w-7xl mx-auto px-4 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link to='/' className="flex items-center gap-2">
            <School size={28} className="text-blue-600" />
            <h1 className='font-extrabold text-xl md:text-2xl'>LMS-Learning</h1>
          </Link>
        </div>

        {/* User icons and dark mode icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/my-learning" className="w-full">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to='/profile' className="w-full">Edit Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuItem>
                      <Link to='/admin/dashboard' className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/login')} variant="outline">Login</Button>
              <Button onClick={() => navigate("/login")}>Sign Up</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to='/' className="flex items-center gap-2">
          <School size={24} className="text-blue-600" />
          <h1 className='font-bold text-lg'>LMS-Learning</h1>
        </Link>

        <div className="flex items-center gap-2">
          <MobileNavbar user={user} logoutHandler={logoutHandler} />
        </div>
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full"
          variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <School size={24} className="text-blue-600" />
            <SheetTitle>LMS-Learning</SheetTitle>
          </div>
          <DarkMode />
        </SheetHeader>

        <div className="flex-1 overflow-auto py-6">
          <nav className='flex flex-col space-y-4'>
            <Link to="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/my-learning" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                  My Learning
                </Link>
                <Link to="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                  Edit Profile
                </Link>
                {user.role === "instructor" && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left w-full"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button onClick={() => navigate('/login')} className="w-full" variant="outline">
                    Login
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Sign Up
                  </Button>
                </SheetClose>
              </>
            )}
          </nav>
        </div>

        <SheetFooter className="border-t pt-4">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} LMS-Learning. All rights reserved.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}