import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './appRedux/store'
import { Toaster } from "@/components/ui/sonner"
import { useLoadUserQuery } from './featureSlice/api/authApi'
import InfinityLoader from './components/ui/LoadingSpinner'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();

  return <>
    {
      isLoading ? <h1><InfinityLoader /></h1> : <>{children}</>
    }
  </>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Custom>
        <App />
      </Custom>
      <Toaster />
    </Provider>

  </StrictMode>,
)
