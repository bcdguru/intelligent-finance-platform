import { useState } from 'react'
import { Theme } from '@carbon/react'
import TopNav from './components/TopNav'
import ModuleView from './components/ModuleView'
import AtlasViewer from './components/AtlasViewer'
import { MODULES } from './data/modules'

export default function App() {
  const [activeModule, setActiveModule] = useState('r2r')
  const isAtlas = activeModule === 'atlas'

  return (
    <Theme theme="white">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Theme theme="g100">
          <TopNav activeModule={activeModule} onModuleChange={setActiveModule} />
        </Theme>
        {isAtlas
          ? <AtlasViewer key="atlas" />
          : <ModuleView key={activeModule} module={MODULES[activeModule]} onModuleChange={setActiveModule} />
        }
      </div>
    </Theme>
  )
}
