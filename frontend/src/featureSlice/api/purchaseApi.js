import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from '@/config/apiConfig';

// Create a custom base query with error handling for purchase API
const purchaseBaseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_ENDPOINTS.PURCHASE_API,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  });

  try {
    // Attempt the regular query
    const result = await baseQuery(args, api, extraOptions);

    // Return the result if successful
    return result;
  } catch (error) {
    console.error('Purchase API request failed:', error);

    // If the server is down, return a mock response for certain operations
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.warn('Server appears to be down, using mock data for purchase API');

      // Handle different types of requests with mock responses
      const url = typeof args === 'string' ? args : args.url;
      const method = args.method || 'GET';

      // For checkout session creation
      if (method === 'POST' && url.includes('checkout')) {
        return {
          data: {
            success: true,
            message: 'Checkout session created (mock response - server is down)',
            url: '/course-progress/mock-course-id',
            alreadyPurchased: false
          },
        };
      }

      // For course detail status
      if (method === 'GET' && url.includes('details-with-status')) {
        const courseId = url.split('/')[2]; // Extract course ID from URL
        return {
          data: {
            course: {
              _id: courseId,
              courseTitle: 'Mock Course',
              subTitle: 'Mock Subtitle',
              description: 'This is a mock course description for when the server is down.',
              category: 'Web Development',
              courseLevel: 'Intermediate',
              coursePrice: 1999,
              isPublished: true,
              creator: {
                name: 'Mock Instructor',
                photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
              },
              lectures: [
                {
                  _id: 'mock-lecture-1',
                  lectureTitle: 'Introduction',
                  isPreviewFree: true
                },
                {
                  _id: 'mock-lecture-2',
                  lectureTitle: 'Getting Started',
                  isPreviewFree: false
                }
              ]
            },
            purchased: false
          },
        };
      }

      // For purchased courses
      if (method === 'GET' && url === '/') {
        return {
          data: {
            purchasedCourse: [
              {
                _id: 'mock-purchase-1',
                courseId: {
                  _id: 'mock-course-1',
                  courseTitle: 'React Masterclass',
                  courseThumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
                  coursePrice: 1999
                },
                status: 'completed'
              }
            ]
          },
        };
      }

      // Default mock response
      return {
        error: {
          status: 503,
          data: {
            message: 'Server is currently unavailable. Please try again later.'
          }
        },
      };
    }

    // Re-throw the error for other cases
    throw error;
  }
};

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: purchaseBaseQueryWithErrorHandling,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: '/checkout/create-checkout-session',
        method: "POST",
        body: { courseId }
      })
    }),
    getCourseDetailStatus: builder.query({
      query:(courseId) => ({
        url: `/course/${courseId}/details-with-status`,
        method:"GET"
      })
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url:'/',
        method:"GET"
      })
    })

  })
})

export const {useCreateCheckoutSessionMutation, useGetPurchasedCoursesQuery, useGetCourseDetailStatusQuery} = purchaseApi;