import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { UpdatePrompt } from './components/ui/UpdatePrompt'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <UpdatePrompt />
    </>
  )
}

export default App
