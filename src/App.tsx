import { useState } from 'react'
import type { KnowledgeSpace, ChatMessage } from './types'

// Initial knowledge spaces setup
const initialPersonalSpaces: KnowledgeSpace[] = [
  {
    id: 'p1',
    name: 'My Clinical Notes',
    type: 'personal',
    isActive: true,
    documentCount: 47,
    description: 'Personal clinical observations'
  },
  {
    id: 'p2',
    name: 'Saved Research',
    type: 'personal',
    isActive: true,
    documentCount: 23,
    description: 'Research papers and articles'
  },
  {
    id: 'p3',
    name: 'Case Studies',
    type: 'personal',
    isActive: true,
    documentCount: 15,
    description: 'Interesting clinical cases'
  }
]

const initialOrgSpaces: KnowledgeSpace[] = [
  {
    id: 'o1',
    name: 'Emergency Medicine Protocols',
    type: 'organization',
    isActive: false,
    documentCount: 156,
    description: 'Hospital emergency procedures'
  },
  {
    id: 'o2',
    name: 'Critical Care Guidelines',
    type: 'organization',
    isActive: false,
    documentCount: 89,
    description: 'ICU and critical care protocols'
  },
  {
    id: 'o3',
    name: 'Pharmacy Treatment Standards',
    type: 'organization',
    isActive: false,
    documentCount: 234,
    description: 'Drug protocols and formulary'
  }
]

function App() {
  const [personalSpaces] = useState(initialPersonalSpaces)
  const [orgSpaces, setOrgSpaces] = useState(initialOrgSpaces)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: 'Welcome! I can search your personal knowledge spaces and suggest organizational resources when needed. What would you like to know?',
      sender: 'assistant',
      timestamp: new Date(),
      quickReplies: [
        { id: 'q1', text: 'Show my active spaces', action: 'show_active' },
        { id: 'q2', text: 'Search treatment protocols', action: 'search_protocols' },
        { id: 'q3', text: 'Recent medical research', action: 'search_research' }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const activateOrgSpaces = (spaceIds: string[]) => {
    setOrgSpaces(spaces =>
      spaces.map(space =>
        spaceIds.includes(space.id) ? { ...space, isActive: true } : space
      )
    )
  }

  const handleSendMessage = (content: string) => {
    // Only add user message if content is not empty (to avoid empty messages from re-runs)
    if (content.trim()) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }

    // Simulate search and response
    setTimeout(() => {
      const activePersonal = personalSpaces.filter(s => s.isActive)
      
      // Check if query is about protocols/treatments that would benefit from org resources
      const needsOrgData = content.toLowerCase().includes('protocol') || 
                          content.toLowerCase().includes('treatment') ||
                          content.toLowerCase().includes('guideline') ||
                          content.toLowerCase().includes('diabetes') ||
                          content.toLowerCase().includes('management') ||
                          content.toLowerCase().includes('emergency')

      if (needsOrgData && orgSpaces.every(s => !s.isActive)) {
        // First response: searched personal spaces with limited results
        const searchResponse: ChatMessage = {
          id: `search-${Date.now()}`,
          content: `I searched your personal knowledge spaces and found limited information:

**From My Clinical Notes:**
- Basic diabetes patient observations
- Individual case notes without standardized protocols
- Personal clinical experiences and notes

**From Saved Research:**
- General diabetes research articles
- Individual study findings
- Academic papers on diabetes complications

**From Case Studies:**
- Patient cases mentioning diabetes management
- Individual treatment outcomes

However, I didn't find comprehensive, evidence-based clinical protocols or standardized treatment guidelines for diabetes management in your personal spaces.`,
          sender: 'assistant',
          timestamp: new Date(),
          sources: activePersonal.slice(0, 2).map(space => ({
            spaceId: space.id,
            spaceName: space.name,
            relevance: 'low' as const
          }))
        }
        setMessages(prev => [...prev, searchResponse])

        // Follow-up suggestion for org resources
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

          // Show available org spaces with relevant document counts
          setTimeout(() => {
            const orgOptionsMessage: ChatMessage = {
              id: `org-options-${Date.now()}`,
              content: `**Available organizational resources:**\n\n🏥 **Emergency Medicine Protocols** (8 diabetes-related documents)\n🏥 **Critical Care Guidelines** (12 diabetes management protocols)\n💊 **Pharmacy Treatment Standards** (15 diabetes medication guidelines)`,
              sender: 'system',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, orgOptionsMessage])
          }, 500)
        }, 1000)
      } else if (orgSpaces.some(s => s.isActive)) {
        // Search with org spaces included
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
            { id: 'view-medication-guide', label: 'View Medication Guide', action: 'view_medication_guide', variant: 'secondary' },
            { id: 'print-protocol', label: 'Print Quick Reference', action: 'print_protocol', variant: 'ghost' }
          ]
        }
        setMessages(prev => [...prev, comprehensiveResponse])
      } else {
        // Regular personal search with detailed explanation
        const personalResponse: ChatMessage = {
          id: `personal-${Date.now()}`,
          content: `I found some information in your personal knowledge spaces:

**From My Clinical Notes:**
- Patient case notes mentioning diabetes complications
- Blood glucose monitoring observations
- Personal treatment response notes

**From Saved Research:**
- Academic articles on diabetes pathophysiology
- Research papers on newer diabetes medications
- Studies on lifestyle interventions

However, these personal resources lack comprehensive clinical protocols and standardized treatment guidelines. For evidence-based management protocols, I recommend accessing organizational knowledge spaces.`,
          sender: 'assistant',
          timestamp: new Date(),
          sources: activePersonal.slice(0, 2).map(space => ({
            spaceId: space.id,
            spaceName: space.name,
            relevance: 'medium' as const
          })),
          actions: [
            { id: 'search-org', label: 'Search Organization Resources', action: 'search_org_diabetes', variant: 'primary' },
            { id: 'view-personal', label: 'View Personal Notes', action: 'view_personal_notes', variant: 'secondary' }
          ]
        }
        setMessages(prev => [...prev, personalResponse])
      }
    }, 1000)
  }

  const handleQuickReply = (action: string) => {
    if (action === 'show_active') {
      const activePersonal = personalSpaces.filter(s => s.isActive)
      const activeOrg = orgSpaces.filter(s => s.isActive)
      const statusMessage: ChatMessage = {
        id: `status-${Date.now()}`,
        content: `**Active Knowledge Spaces:**

**Personal (${activePersonal.length} active):**
${activePersonal.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n')}

**Organization (${activeOrg.length} active):**
${activeOrg.length > 0 ? activeOrg.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n') : 'None currently active'}`,
        sender: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, statusMessage])
    } else if (action === 'search_protocols') {
      handleSendMessage('What are the current diabetes management protocols?')
    } else if (action === 'search_research') {
      handleSendMessage('Show me recent research on emergency medicine')
    }
  }

  const handleAction = (action: string) => {
    if (action === 'include_all_org') {
      const allOrgIds = orgSpaces.map(s => s.id)
      activateOrgSpaces(allOrgIds)
      
      // Directly show comprehensive response from organizational spaces
      setTimeout(() => {
        const activeOrg = orgSpaces.map(space => ({ ...space, isActive: true }))
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
            { id: 'view-medication-guide', label: 'View Medication Guide', action: 'view_medication_guide', variant: 'secondary' },
            { id: 'print-protocol', label: 'Print Quick Reference', action: 'print_protocol', variant: 'ghost' }
          ]
        }
        setMessages(prev => [...prev, comprehensiveResponse])
      }, 500)
    } else if (action === 'select_specific') {
      const selectMessage: ChatMessage = {
        id: `select-${Date.now()}`,
        content: 'Which organizational spaces would you like to include?',
        sender: 'assistant',
        timestamp: new Date(),
        quickReplies: [
          { id: 'select-emergency', text: 'Emergency Medicine Protocols', action: 'select_emergency' },
          { id: 'select-critical', text: 'Critical Care Guidelines', action: 'select_critical' },
          { id: 'select-pharmacy', text: 'Pharmacy Treatment Standards', action: 'select_pharmacy' }
        ]
      }
      setMessages(prev => [...prev, selectMessage])
    } else if (action === 'select_emergency') {
      activateOrgSpaces(['o1'])
      const confirmMessage: ChatMessage = {
        id: `confirm-emergency-${Date.now()}`,
        content: '✓ Added Emergency Medicine Protocols to your search scope.',
        sender: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, confirmMessage])
    } else if (action === 'decline_org') {
      const declineMessage: ChatMessage = {
        id: `decline-${Date.now()}`,
        content: 'Understood. I\'ll continue searching only your personal knowledge spaces. You can always ask me to include organizational resources later.',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, declineMessage])
    } else if (action === 'search_org_diabetes') {
      const suggestMessage: ChatMessage = {
        id: `suggest-org-${Date.now()}`,
        content: 'Would you like me to search organizational knowledge spaces for comprehensive diabetes management protocols?',
        sender: 'assistant',
        timestamp: new Date(),
        actions: [
          { id: 'include-all', label: 'Yes, Include All', action: 'include_all_org', variant: 'primary' },
          { id: 'select-specific', label: 'Select Specific', action: 'select_specific', variant: 'secondary' }
        ]
      }
      setMessages(prev => [...prev, suggestMessage])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Visual Status Only */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Knowledge Spaces</h1>
          <p className="text-sm text-gray-600 mt-1">Status View Only</p>
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

          {/* Organization Section - Only show when at least one org space is active */}
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
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Healthcare Assistant</h2>
          <p className="text-sm text-gray-600">All interactions happen here - ask questions to get started</p>
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