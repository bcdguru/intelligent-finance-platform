import { useState } from 'react'
import { Theme } from '@carbon/react'
import TopNav from './TopNav'
import ModuleShell from './ModuleShell'
import AtlasViewer from '../components/AtlasViewer'
import { MODULE_REGISTRY } from '../registry'

export default function App() {
  const [activeModule, setActiveModule] = useState('r2r')
  const moduleEntry = MODULE_REGISTRY[activeModule]
  const isAtlas = moduleEntry?.config?.isAtlas ?? false

  return (
    <Theme theme="white">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Theme theme="g100">
          <TopNav activeModule={activeModule} onModuleChange={setActiveModule} />
        </Theme>
        {isAtlas
          ? <AtlasViewer key="atlas" />
          : <ModuleShell key={activeModule} module={moduleEntry.config} onModuleChange={setActiveModule} />
        }
      </div>
    </Theme>
  )
}
