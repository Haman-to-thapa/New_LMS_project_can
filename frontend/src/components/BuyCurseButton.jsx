import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/featureSlice/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BuyCurseButton = ({ courseId }) => {
  const [createCheckoutSession, { data, isLoading, error, isError, isSuccess }] = useCreateCheckoutSessionMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const purchaseCourseHandler = async () => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    try {
      // Check if user is logged in by checking for token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to purchase this course");
        // Redirect to login page
        navigate('/login');
        return;
      }

      await createCheckoutSession(courseId);
    } catch (err) {
      console.error("Error creating checkout session:", err);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  }

  useEffect(() => {
    // Handle successful checkout
    if (isSuccess && data) {
      // Check if we have a URL to redirect to
      if (data.url) {
        // Show success message before redirecting
        toast.success(data.message || "Course purchased successfully!");
        setIsRedirecting(true);

        // Short delay before redirecting to ensure toast is seen
        setTimeout(() => {
          try {
            // Use navigate for react-router routes, window.location for external URLs
            if (data.url.startsWith('/')) {
              navigate(data.url);
            } else {
              window.location.assign(data.url);
            }
          } catch (err) {
            console.error("Navigation error:", err);
            toast.error("Error navigating to course page. Please try again.");
            setIsRedirecting(false);
          }
        }, 1500);
      } else if (data.alreadyPurchased) {
        // Handle case where course is already purchased
        toast.info(data.message || "You already own this course");
        setIsRedirecting(true);

        setTimeout(() => {
          try {
            if (data.url && data.url.startsWith('/')) {
              navigate(data.url);
            } else if (data.url) {
              window.location.assign(data.url);
            } else {
              // If no URL is provided, navigate to my-learning page
              navigate('/my-learning');
            }
          } catch (err) {
            console.error("Navigation error:", err);
            toast.error("Error navigating to course page. Please try again.");
            setIsRedirecting(false);
          }
        }, 1500);
      } else {
        toast.error("Error: Invalid response from server");
      }
    }

    // Handle error cases
    if (isError) {
      setIsRedirecting(false);

      // Check for authentication errors
      if (error?.status === 401) {
        toast.error("Please log in to purchase this course");
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      // Check for server errors
      if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }

      // Check for connection errors
      if (error?.status === 'FETCH_ERROR' || error?.error === 'TypeError: Failed to fetch') {
        console.warn("Server connection error, using mock flow");

        // Show a warning toast
        toast.warning("Server is currently unavailable. Using demo mode.");

        // Simulate a successful purchase with mock data
        setIsRedirecting(true);

        setTimeout(() => {
          // Navigate to a mock course progress page
          navigate(`/course-progress/mock-course-${courseId}`);
        }, 1500);

        return;
      }

      // Handle other errors
      const errorMessage = error?.data?.message ||
        error?.error ||
        "Failed to create checkout session";
      toast.error(errorMessage);
    }
  }, [data, isSuccess, isError, error, navigate]);

  return (
    <Button
      className='w-full'
      onClick={purchaseCourseHandler}
      disabled={isLoading || isRedirecting}
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Processing...
        </>
      ) : isRedirecting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  )
}

export default BuyCurseButton
