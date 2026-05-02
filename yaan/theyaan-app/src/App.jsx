import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TheYaanStudio from './TheYaanStudio'
import TheYaanStudioOld from './TheYaanStudioOld'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import AntarYaan from './antaryaan/AntarYaan'
import Pulse from './pulse/Pulse'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TheYaanStudio />} />
        <Route path="/oldweb" element={<TheYaanStudioOld />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/antaryaan/*" element={<AntarYaan />} />
        <Route path="/pulse/*" element={<Pulse />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
