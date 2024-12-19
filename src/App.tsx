import { Suspense } from "react"
import { useRoutes } from "react-router"
import routes from "~react-pages"
import Loading from "./components/Loading"

function App() {
  return (
    <Suspense fallback={<Loading />}>
      {useRoutes(routes)}
    </Suspense>
  )
}

export default App
