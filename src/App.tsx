import { useState } from 'react'
import type { KnowledgeSpace, ChatMessage, Scenario } from './types'
import ScenarioSelector from './components/ScenarioSelector'

function App() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [personalSpaces, setPersonalSpaces] = useState<KnowledgeSpace[]>([])
  const [orgSpaces, setOrgSpaces] = useState<KnowledgeSpace[]>([])
  const [specializedSpaces, setSpecializedSpaces] = useState<KnowledgeSpace[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setPersonalSpaces(scenario.initialPersonalSpaces)
    setOrgSpaces(scenario.initialOrgSpaces)
    setSpecializedSpaces(scenario.specializedSpaces || [])
    setMessages(scenario.initialMessages)
  }

  const activateOrgSpaces = (spaceIds: string[]) => {
    setOrgSpaces(spaces =>
      spaces.map(space =>
        spaceIds.includes(space.id) ? { ...space, isActive: true } : space
      )
    )
  }

  const activateSpecializedSpaces = (spaceIds: string[]) => {
    setSpecializedSpaces(spaces =>
      spaces.map(space =>
        spaceIds.includes(space.id) ? { ...space, isActive: true } : space
      )
    )
  }

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }

    // Route to appropriate workflow handler
    setTimeout(() => {
      if (currentScenario?.workflowType === 'diabetes') {
        handleDiabetesWorkflow(content)
      } else if (currentScenario?.workflowType === 'multi-domain') {
        handleMultiDomainWorkflow(content)
      }
    }, 1000)
  }

  const handleDiabetesWorkflow = (content: string) => {
    const activePersonal = personalSpaces.filter(s => s.isActive)
    
    const needsOrgData = content.toLowerCase().includes('protocol') || 
                        content.toLowerCase().includes('treatment') ||
                        content.toLowerCase().includes('guideline') ||
                        content.toLowerCase().includes('diabetes') ||
                        content.toLowerCase().includes('management')

    if (needsOrgData && orgSpaces.every(s => !s.isActive)) {
      // Personal search response
      const searchResponse: ChatMessage = {
        id: `search-${Date.now()}`,
        content: `I searched your personal knowledge spaces and found limited information:

**From My Clinical Notes:**
- Basic diabetes patient observations
- Individual case notes without standardized protocols

**From Saved Research:**
- General diabetes research articles
- Individual study findings

**From Case Studies:**
- Patient cases mentioning diabetes management

However, I didn't find comprehensive, evidence-based clinical protocols for diabetes management in your personal spaces.`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activePersonal.slice(0, 2).map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'low' as const
        }))
      }
      setMessages(prev => [...prev, searchResponse])

      // Suggest org resources
      setTimeout(() => {
        const suggestionMessage: ChatMessage = {
          id: `suggest-${Date.now()}`,
          content: 'However, I found relevant information in organization-wide knowledge spaces. Would you like me to expand the search to include:',
          sender: 'assistant',
          timestamp: new Date(),
          actions: [
            { id: 'include-all', label: 'Include All', action: 'include_all_org', variant: 'primary' },
            { id: 'select-specific', label: 'Select Specific', action: 'select_specific', variant: 'secondary' },
            { id: 'no-thanks', label: 'No, thanks', action: 'decline_org', variant: 'ghost' }
          ]
        }
        setMessages(prev => [...prev, suggestionMessage])

        setTimeout(() => {
          const orgOptionsMessage: ChatMessage = {
            id: `org-options-${Date.now()}`,
            content: `**Available organizational resources:**

🏥 **Emergency Medicine Protocols** (8 diabetes-related documents)
🏥 **Critical Care Guidelines** (12 diabetes management protocols)
💊 **Pharmacy Treatment Standards** (15 diabetes medication guidelines)`,
            sender: 'system',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, orgOptionsMessage])
        }, 500)
      }, 1000)
    } else if (orgSpaces.some(s => s.isActive)) {
      // Show comprehensive diabetes protocol
      const activeOrg = orgSpaces.filter(s => s.isActive)
      const comprehensiveResponse: ChatMessage = {
        id: `comprehensive-${Date.now()}`,
        content: `**Type 2 Diabetes Management Protocol**
*Based on ${activeOrg.map(s => s.name).join(' and ')}*

**Initial Assessment:**
- HbA1c >7% indicates need for intensified management
- Assess for diabetic complications (retinopathy, nephropathy, neuropathy)
- Review cardiovascular risk factors

**First-Line Treatment:**
- **Metformin** 500mg BID, titrate to 1000mg BID (max 2000mg/day)
- Target HbA1c <7% for most adults
- Monitor eGFR before initiation (contraindicated if <30 mL/min/1.73m²)

**Second-Line Options (if HbA1c remains >7% after 3 months):**
- **GLP-1 agonists**: Semaglutide 0.25mg weekly (cardiovascular benefits)
- **SGLT-2 inhibitors**: Empagliflozin 10mg daily (renal protection)
- **Insulin**: Basal insulin (Glargine) starting 10 units at bedtime

**Monitoring:**
- HbA1c every 3 months until target achieved, then every 6 months
- Annual comprehensive foot exam and eye screening
- Quarterly blood pressure and lipid monitoring

**Emergency Protocols:**
- **DKA**: pH <7.3, glucose >250mg/dL, ketones positive
- **Hypoglycemia**: <70mg/dL - 15g fast-acting carbs, recheck in 15 min`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeOrg.map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'high' as const
        })),
        actions: [
          { id: 'save-protocol', label: 'Save to My Notes', action: 'save_to_notes', variant: 'primary' },
          { id: 'view-medication-guide', label: 'View Medication Guide', action: 'view_medication_guide', variant: 'secondary' }
        ]
      }
      setMessages(prev => [...prev, comprehensiveResponse])
    }
  }

  const handleMultiDomainWorkflow = (content: string) => {
    const isHeartQuery = content.toLowerCase().includes('heart') ||
                        content.toLowerCase().includes('cardiac') ||
                        content.toLowerCase().includes('cardiology') ||
                        content.toLowerCase().includes('failure')

    if (isHeartQuery && specializedSpaces.every(s => !s.isActive)) {
      // Limited results from current spaces
      const activeSpaces = [...personalSpaces, ...orgSpaces].filter(s => s.isActive)
      const searchResponse: ChatMessage = {
        id: `heart-search-${Date.now()}`,
        content: `I found general information in your current spaces about diabetic complications, but limited specific cardiology protocols for heart failure management in diabetic patients.`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeSpaces.slice(0, 2).map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'medium' as const
        }))
      }
      setMessages(prev => [...prev, searchResponse])

      // Suggest specialized spaces
      setTimeout(() => {
        const suggestionMessage: ChatMessage = {
          id: `specialized-suggest-${Date.now()}`,
          content: 'I found specialized cardiology resources that would provide comprehensive guidelines for diabetic heart complications:',
          sender: 'assistant',
          timestamp: new Date(),
          actions: [
            { id: 'include-specialized', label: 'Include Both', action: 'include_specialized_spaces', variant: 'primary' },
            { id: 'select-cardiology', label: 'Cardiology Only', action: 'select_cardiology', variant: 'secondary' },
            { id: 'select-peer', label: 'Peer Studies Only', action: 'select_peer', variant: 'secondary' }
          ]
        }
        setMessages(prev => [...prev, suggestionMessage])

        setTimeout(() => {
          const specializedOptionsMessage: ChatMessage = {
            id: `specialized-options-${Date.now()}`,
            content: `**Available specialized resources:**

🫀 **Cardiology Guidelines** (Organization-wide) - 24 relevant protocols
👥 **Peer Curated Heart Studies** (Co-doctor network) - 18 case studies`,
            sender: 'system',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, specializedOptionsMessage])
        }, 500)
      }, 1000)
    } else if (specializedSpaces.some(s => s.isActive)) {
      // Show comprehensive heart + diabetes response
      const activeAll = [...personalSpaces, ...orgSpaces, ...specializedSpaces].filter(s => s.isActive)
      
      const comprehensiveResponse: ChatMessage = {
        id: `heart-comprehensive-${Date.now()}`,
        content: `**Heart Failure Management in Diabetic Patients**
*Integrating diabetes protocols with specialized cardiology guidelines*

**Risk Assessment:**
- Diabetic cardiomyopathy screening with echocardiogram
- BNP/NT-proBNP levels (adjusted for diabetic kidney disease)
- Assessment of coronary artery disease risk

**Integrated Management:**
- **SGLT-2 inhibitors**: Empagliflozin 10mg daily (dual cardiac + glycemic benefits)
- **ACE inhibitors**: Lisinopril 10mg daily, titrate to max tolerated dose
- **Beta-blockers**: Metoprolol succinate 25mg BID (heart failure specific)

**Diabetes-Specific Considerations:**
- Avoid TZDs (increased fluid retention risk)
- Monitor for hypoglycemia with heart failure medications
- Adjust insulin doses during acute decompensation

**Monitoring Protocol:**
- Weekly weights during titration
- Monthly eGFR and electrolytes
- Quarterly HbA1c and echocardiogram
- Semi-annual stress testing if stable

**Emergency Management:**
- Acute decompensation: IV diuretics + glucose monitoring
- Hypoglycemia risk increased with poor oral intake
- Coordinate with endocrinology for insulin adjustments`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeAll.map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: space.type === 'specialized' ? 'high' as const : 'medium' as const
        })),
        actions: [
          { id: 'save-integrated', label: 'Save Integration Protocol', action: 'save_integrated_protocol', variant: 'primary' },
          { id: 'consult-cardiology', label: 'Request Cardiology Consult', action: 'request_consult', variant: 'secondary' }
        ]
      }
      setMessages(prev => [...prev, comprehensiveResponse])
    }
  }

  const handleQuickReply = (action: string) => {
    if (action === 'show_active') {
      const activePersonal = personalSpaces.filter(s => s.isActive)
      const activeOrg = orgSpaces.filter(s => s.isActive)
      const activeSpecialized = specializedSpaces.filter(s => s.isActive)
      
      let content = `**Active Knowledge Spaces:**

**Personal (${activePersonal.length} active):**
${activePersonal.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n')}

**Organization (${activeOrg.length} active):**
${activeOrg.length > 0 ? activeOrg.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n') : 'None currently active'}`

      if (activeSpecialized.length > 0) {
        content += `

**Specialized (${activeSpecialized.length} active):**
${activeSpecialized.map(s => `${s.icon} ${s.name} (${s.documentCount} documents)`).join('\n')}`
      }

      const statusMessage: ChatMessage = {
        id: `status-${Date.now()}`,
        content,
        sender: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, statusMessage])
    } else if (action === 'search_diabetes_protocols') {
      handleSendMessage('What are the current diabetes management protocols?')
    } else if (action === 'search_heart_diabetes') {
      handleSendMessage('What are the current guidelines for managing heart failure in diabetic patients?')
    }
  }

  const handleAction = (action: string) => {
    if (action === 'include_all_org') {
      const allOrgIds = orgSpaces.map(s => s.id)
      activateOrgSpaces(allOrgIds)
      
      setTimeout(() => {
        if (currentScenario?.workflowType === 'diabetes') {
          handleDiabetesWorkflow('')
        }
      }, 500)
    } else if (action === 'include_specialized_spaces') {
      const allSpecializedIds = specializedSpaces.map(s => s.id)
      activateSpecializedSpaces(allSpecializedIds)
      
      setTimeout(() => {
        if (currentScenario?.workflowType === 'multi-domain') {
          handleMultiDomainWorkflow('heart failure diabetic patients')
        }
      }, 500)
    } else if (action === 'select_cardiology') {
      activateSpecializedSpaces(['ms1'])
    } else if (action === 'select_peer') {
      activateSpecializedSpaces(['ms2'])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleBackToSelector = () => {
    setCurrentScenario(null)
    setPersonalSpaces([])
    setOrgSpaces([])
    setSpecializedSpaces([])
    setMessages([])
    setInputValue('')
  }

  // Show scenario selector if no scenario is selected
  if (!currentScenario) {
    return <ScenarioSelector onSelectScenario={handleScenarioSelect} />
  }

  // Main application interface
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-900">Knowledge Spaces</h1>
            <button
              onClick={handleBackToSelector}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Switch Scenario
            </button>
          </div>
          <p className="text-sm text-gray-600">{currentScenario.name}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Personal Section */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-sm font-medium text-gray-900">Personal</h2>
            </div>
            <div className="space-y-2">
              {personalSpaces.map(space => (
                <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{space.name}</h3>
                      <span className="text-xs text-gray-500">{space.documentCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">{space.description}</p>
                  </div>
                  <div className={`ml-3 w-8 h-4 rounded-full flex items-center ${
                    space.isActive ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      space.isActive ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organization Section */}
          {orgSpaces.some(space => space.isActive) && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-gray-900">Organization</h2>
              </div>
              <div className="space-y-2">
                {orgSpaces.filter(space => space.isActive).map(space => (
                  <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900">{space.name}</h3>
                        <span className="text-xs text-gray-500">{space.documentCount}</span>
                      </div>
                      <p className="text-xs text-gray-600">{space.description}</p>
                    </div>
                    <div className="ml-3 w-8 h-4 rounded-full flex items-center bg-green-600">
                      <div className="w-3 h-3 rounded-full bg-white translate-x-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Section */}
          {specializedSpaces.some(space => space.isActive) && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-gray-900">Specialized</h2>
              </div>
              <div className="space-y-2">
                {specializedSpaces.filter(space => space.isActive).map(space => (
                  <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">{space.icon}</span>
                          <h3 className="text-sm font-medium text-gray-900">{space.name}</h3>
                        </div>
                        <span className="text-xs text-gray-500">{space.documentCount}</span>
                      </div>
                      <p className="text-xs text-gray-600">{space.description}</p>
                    </div>
                    <div className="ml-3 w-8 h-4 rounded-full flex items-center bg-purple-600">
                      <div className="w-3 h-3 rounded-full bg-white translate-x-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Healthcare Assistant</h2>
          <p className="text-sm text-gray-600">{currentScenario.description}</p>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.sender === 'system'
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Sources:</p>
                      <div className="space-y-1">
                        {message.sources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span>{source.spaceName}</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              source.relevance === 'high' ? 'bg-green-100 text-green-700' : 
                              source.relevance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {source.relevance}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {message.quickReplies && (
                    <div className="mt-3 space-y-1">
                      {message.quickReplies.map(reply => (
                        <button
                          key={reply.id}
                          onClick={() => handleQuickReply(reply.action)}
                          className="block w-full px-3 py-2 text-sm text-left text-blue-700 bg-white border border-blue-200 rounded-md hover:bg-blue-50"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Actions */}
                  {message.actions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map(action => (
                        <button
                          key={action.id}
                          onClick={() => handleAction(action.action)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                            action.variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
                            'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="max-w-3xl mx-auto flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about protocols, treatments, or search your knowledge..."
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App