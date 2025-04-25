import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { School, Home, Search } from 'lucide-react'

const NoPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-background text-center px-4">
      <div className="mb-6 p-6 rounded-full bg-blue-100 dark:bg-blue-900">
        <School size={64} className="text-blue-600 dark:text-blue-400" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home size={18} />
            <span>Go Home</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link to="/search">
            <Search size={18} />
            <span>Search Courses</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NoPage;
