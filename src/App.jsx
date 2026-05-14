import { useState } from 'react'
import TopNav from './components/TopNav'
import ModuleView from './components/ModuleView'
import { MODULES } from './data/modules'

export default function App() {
  const [activeModule, setActiveModule] = useState('r2r')

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopNav activeModule={activeModule} onModuleChange={setActiveModule} />
      <ModuleView key={activeModule} module={MODULES[activeModule]} />
    </div>
  )
}
