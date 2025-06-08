import { useState } from 'react'
import type { KnowledgeSpace, ChatMessage, Scenario } from './types'
import ScenarioSelector from './components/ScenarioSelector'

function App() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [personalSpaces, setPersonalSpaces] = useState<KnowledgeSpace[]>([])
  const [orgSpaces, setOrgSpaces] = useState<KnowledgeSpace[]>([])
  const [sharedSpaces, setSharedSpaces] = useState<KnowledgeSpace[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isPersonalExpanded, setIsPersonalExpanded] = useState(true)
  const [isOrgExpanded, setIsOrgExpanded] = useState(true)
  const [isSharedExpanded, setIsSharedExpanded] = useState(true)

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setPersonalSpaces(scenario.initialPersonalSpaces)
    setOrgSpaces(scenario.initialOrgSpaces)
    setSharedSpaces(scenario.initialSharedSpaces || [])
    setMessages(scenario.initialMessages)
  }

  const activateOrgSpaces = (spaceIds: string[], callback?: (updatedSpaces: KnowledgeSpace[]) => void) => {
    setOrgSpaces(spaces => {
      const updatedSpaces = spaces.map(space =>
        spaceIds.includes(space.id) ? { ...space, isActive: true } : space
      )
      // Call callback after state update with updated spaces
      if (callback) {
        setTimeout(() => callback(updatedSpaces), 100)
      }
      return updatedSpaces
    })
  }

  const activateSharedSpaces = (spaceIds: string[], callback?: (updatedSpaces: KnowledgeSpace[]) => void) => {
    setSharedSpaces(spaces => {
      const updatedSpaces = spaces.map(space =>
        spaceIds.includes(space.id) ? { ...space, isActive: true } : space
      )
      // Call callback after state update with updated spaces
      if (callback) {
        setTimeout(() => callback(updatedSpaces), 100)
      }
      return updatedSpaces
    })
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
        content: `**Comprehensive Type 2 Diabetes Management Protocol**
*Based on ${activeOrg.map(s => s.name).join(', ')} - Organization Standards*

**🔍 Initial Assessment & Risk Stratification:**
- HbA1c >7% indicates need for intensified management
- Comprehensive diabetic complications screening:
  - **Retinopathy**: Annual dilated eye exam with ophthalmology
  - **Nephropathy**: Annual microalbumin, eGFR monitoring
  - **Neuropathy**: Annual foot exam with 10g monofilament test
- **Cardiovascular risk assessment**: Calculate 10-year ASCVD risk score
- **Mental health screening**: PHQ-2 for depression (common in T2DM)

**💊 Evidence-Based Treatment Ladder:**

**Step 1 - First-Line (0-3 months):**
- **Metformin** 500mg BID → titrate to 1000mg BID (max 2000mg/day)
- Target HbA1c <7% for most adults (<8% if elderly/comorbid)
- Monitor eGFR baseline and q6 months (contraindicated if <30 mL/min/1.73m²)
- **Lifestyle**: Medical nutrition therapy + 150min/week moderate exercise

**Step 2 - Combination Therapy (if HbA1c >7% after 3 months):**
- **Preferred add-on** (based on patient profile):
  - **SGLT-2 inhibitors** (Empagliflozin 10mg daily): Renal + cardiac protection
  - **GLP-1 agonists** (Semaglutide 0.25mg weekly): Weight loss + CV benefits
  - **DPP-4 inhibitors** (Sitagliptin 100mg daily): Weight neutral, low hypoglycemia risk

**Step 3 - Intensification:**
- **Basal insulin** (Glargine) starting 10 units at bedtime OR 0.2 units/kg
- Titrate by 2-4 units every 3 days based on fasting glucose target 80-130mg/dL

**📊 Monitoring & Follow-up:**
- **HbA1c**: Every 3 months until target achieved, then every 6 months
- **Blood pressure**: Target <140/90 (or <130/80 if high CV risk)
- **Lipids**: Statin therapy if LDL >70mg/dL or high CV risk
- **Weight management**: Document BMI and waist circumference quarterly

**🚨 Emergency Management:**
- **Severe hypoglycemia**: Glucagon 1mg IM/SC if unconscious
- **DKA warning signs**: pH <7.3, glucose >250mg/dL, ketones positive
- **Sick day management**: Continue metformin, increase glucose monitoring

**🎯 Quality Measures:**
- Annual comprehensive foot exam and patient education
- Annual influenza vaccination (increased infection risk)
- Pneumococcal vaccination if ≥65 years or high-risk comorbidities`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeOrg.map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'high' as const
        })),
        actions: [
          { id: 'save-protocol', label: 'Save to My Notes', action: 'save_to_notes', variant: 'primary' },
          { id: 'view-complications', label: 'View Complications Management', action: 'view_complications', variant: 'secondary' },
          { id: 'ask-followup', label: 'Ask Follow-up Question', action: 'ask_followup', variant: 'ghost' }
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

    const isDiabetesQuery = content.toLowerCase().includes('diabetes') ||
                           content.toLowerCase().includes('protocol') ||
                           content.toLowerCase().includes('treatment') ||
                           content.toLowerCase().includes('guideline') ||
                           content.toLowerCase().includes('management') ||
                           content.toLowerCase().includes('hba1c') ||
                           content.toLowerCase().includes('insulin') ||
                           content.toLowerCase().includes('metformin')

    const cardiologyOrgSpaces = orgSpaces.filter(s => s.id === 'mo3')
    const cardiologySharedSpaces = sharedSpaces.filter(s => s.id === 'mo4')
    const isCardiologyActive = [...cardiologyOrgSpaces, ...cardiologySharedSpaces].some(s => s.isActive)

    console.log('Multi-domain workflow debug:', {
      query: content,
      isDiabetesQuery,
      isHeartQuery,
      isCardiologyActive
    })

    // Handle diabetes queries first (since diabetes protocols are already active)
    if (isDiabetesQuery && !isHeartQuery) {
      const activeOrg = orgSpaces.filter(s => s.isActive)
      const diabetesResponse: ChatMessage = {
        id: `diabetes-multidomain-${Date.now()}`,
        content: `**Comprehensive Type 2 Diabetes Management Protocol**
*Based on ${activeOrg.map(s => s.name).join(', ')} - Organization Standards*

**🔍 Initial Assessment & Risk Stratification:**
- HbA1c >7% indicates need for intensified management
- Comprehensive diabetic complications screening:
  - **Retinopathy**: Annual dilated eye exam with ophthalmology
  - **Nephropathy**: Annual microalbumin, eGFR monitoring
  - **Neuropathy**: Annual foot exam with 10g monofilament test
- **Cardiovascular risk assessment**: Calculate 10-year ASCVD risk score
- **Mental health screening**: PHQ-2 for depression (common in T2DM)

**💊 Evidence-Based Treatment Ladder:**

**Step 1 - First-Line (0-3 months):**
- **Metformin** 500mg BID → titrate to 1000mg BID (max 2000mg/day)
- Target HbA1c <7% for most adults (<8% if elderly/comorbid)
- Monitor eGFR baseline and q6 months (contraindicated if <30 mL/min/1.73m²)
- **Lifestyle**: Medical nutrition therapy + 150min/week moderate exercise

**Step 2 - Combination Therapy (if HbA1c >7% after 3 months):**
- **Preferred add-on** (based on patient profile):
  - **SGLT-2 inhibitors** (Empagliflozin 10mg daily): Renal + cardiac protection
  - **GLP-1 agonists** (Semaglutide 0.25mg weekly): Weight loss + CV benefits
  - **DPP-4 inhibitors** (Sitagliptin 100mg daily): Weight neutral, low hypoglycemia risk

**Step 3 - Intensification:**
- **Basal insulin** (Glargine) starting 10 units at bedtime OR 0.2 units/kg
- Titrate by 2-4 units every 3 days based on fasting glucose target 80-130mg/dL

**📊 Monitoring & Follow-up:**
- **HbA1c**: Every 3 months until target achieved, then every 6 months
- **Blood pressure**: Target <140/90 (or <130/80 if high CV risk)
- **Lipids**: Statin therapy if LDL >70mg/dL or high CV risk
- **Weight management**: Document BMI and waist circumference quarterly

**🚨 Emergency Management:**
- **Severe hypoglycemia**: Glucagon 1mg IM/SC if unconscious
- **DKA warning signs**: pH <7.3, glucose >250mg/dL, ketones positive
- **Sick day management**: Continue metformin, increase glucose monitoring

**🎯 Quality Measures:**
- Annual comprehensive foot exam and patient education
- Annual influenza vaccination (increased infection risk)
- Pneumococcal vaccination if ≥65 years or high-risk comorbidities`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeOrg.map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'high' as const
        })),
        actions: [
          { id: 'save-protocol', label: 'Save to My Notes', action: 'save_to_notes', variant: 'primary' },
          { id: 'view-complications', label: 'View Complications Management', action: 'view_complications', variant: 'secondary' },
          { id: 'ask-heart-followup', label: 'Ask About Heart Complications', action: 'ask_heart_followup', variant: 'ghost' }
        ]
      }
      setMessages(prev => [...prev, diabetesResponse])
    } else if (isHeartQuery && !isCardiologyActive) {
      // Limited results from current spaces
      const activeSpaces = [...personalSpaces, ...orgSpaces].filter(s => s.isActive)
      const searchResponse: ChatMessage = {
        id: `heart-search-${Date.now()}`,
        content: `**Heart Failure in Diabetes - Current Knowledge Base Search**

I found relevant information in your active diabetes protocols about cardiovascular complications:

**From Diabetes Management Protocols:**
- SGLT-2 inhibitors (Empagliflozin) provide cardiac protection in diabetic patients
- Cardiovascular risk assessment is part of standard diabetes care
- ACE inhibitors recommended for diabetic nephropathy (also beneficial for heart failure)

**However, I found limited specific cardiology protocols for:**
- Heart failure staging and classification in diabetic patients
- Specialized heart failure medications and dosing
- Diabetic cardiomyopathy management
- Integrated monitoring protocols for dual conditions

**⚠️ Gap Identified:** Comprehensive heart failure management requires specialized cardiology guidelines beyond general diabetes protocols.`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeSpaces.slice(0, 2).map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: 'medium' as const
        }))
      }
      setMessages(prev => [...prev, searchResponse])

      // Suggest cardiology organization spaces
      setTimeout(() => {
        const suggestionMessage: ChatMessage = {
          id: `cardiology-suggest-${Date.now()}`,
          content: `**🔍 Solution: Expand to Cardiology Resources**

I found specialized cardiology resources in our organization that can fill these knowledge gaps and provide comprehensive guidelines for heart failure management in diabetic patients.

**Recommended next step:** Include cardiology protocols to get integrated, evidence-based management strategies that combine both diabetes and heart failure expertise.`,
          sender: 'assistant',
          timestamp: new Date(),
          actions: [
            { id: 'include-cardiology', label: 'Include Both Cardiology Resources', action: 'include_cardiology_spaces', variant: 'primary' },
            { id: 'select-cardiology', label: 'Guidelines Only', action: 'select_cardiology', variant: 'secondary' },
            { id: 'select-peer', label: 'Case Studies Only', action: 'select_peer', variant: 'secondary' }
          ]
        }
        setMessages(prev => [...prev, suggestionMessage])

        setTimeout(() => {
          const cardiologyOptionsMessage: ChatMessage = {
            id: `cardiology-options-${Date.now()}`,
            content: `**Available Cardiology Resources:**

🫀 **Cardiology Guidelines** (Organization-wide)
   • 124 protocols including diabetic cardiomyopathy management
   • Heart failure staging, medication protocols, device considerations
   • Risk stratification and monitoring guidelines

👥 **Peer Curated Heart Studies** (Co-doctor network) 
   • 67 case studies from practicing cardiologists
   • Real-world diabetes + heart failure cases
   • Treatment outcomes and best practices

**Combined benefit:** Integrated protocols that address both conditions simultaneously rather than treating them separately.`,
            sender: 'system',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, cardiologyOptionsMessage])
        }, 500)
      }, 1000)
    } else if (isCardiologyActive) {
      // Show comprehensive heart + diabetes response
      const activeAll = [...personalSpaces, ...orgSpaces, ...sharedSpaces].filter(s => s.isActive)
      
      const comprehensiveResponse: ChatMessage = {
        id: `heart-comprehensive-${Date.now()}`,
        content: `**🫀 Comprehensive Heart Failure Management in Diabetic Patients**
*Integrating Diabetes Management + Cardiology Guidelines + Peer Case Studies*

**🔬 Advanced Risk Stratification:**
- **Diabetic cardiomyopathy assessment**: Echo with strain imaging, diastolic function evaluation
- **Biomarkers**: NT-proBNP >125 pg/mL (adjust for eGFR), Troponin for acute events
- **Coronary evaluation**: Stress testing or CTA if intermediate risk, consider FFR
- **Nephro-cardiac axis**: eGFR, proteinuria, cystatin C for refined risk assessment

**💊 Evidence-Based Integrated Pharmacotherapy:**

**Foundation Therapy (GDMT):**
- **ACE-I/ARB**: Lisinopril 10mg daily → target 40mg daily (dual benefit: diabetic nephropathy + HFrEF)
- **Beta-blocker**: Metoprolol succinate 25mg BID → target 200mg BID (carvedilol alternative if diabetes control issues)
- **MRA**: Spironolactone 25mg daily (monitor K+ closely with diabetes)

**Diabetes-Optimized Add-ons:**
- **SGLT-2 inhibitors**: Empagliflozin 10mg daily (HFrEF benefit independent of diabetes status)
- **GLP-1 agonists**: Semaglutide 1mg weekly (if BMI >30, proven CV outcomes)
- **Metformin**: Continue unless eGFR <30 or hemodynamic instability

**Device/Advanced Therapy Considerations:**
- **ICD**: Primary prevention if LVEF ≤35% despite 3 months optimal medical therapy
- **CRT**: If QRS >150ms with LBBB morphology
- **Heart transplant evaluation**: If refractory HF, but diabetes control must be optimized

**🔄 Integrated Monitoring Protocol:**

**Weekly (during uptitration):**
- Weight, symptoms, blood pressure, heart rate
- Basic metabolic panel (K+, Cr, eGFR)
- Glucose logs review

**Monthly (first 3 months):**
- HbA1c, comprehensive metabolic panel
- Echo if symptoms change
- Medication adherence and side effect assessment

**Quarterly (stable patients):**
- HbA1c, lipid panel, microalbumin
- Echo, 6-minute walk test
- Ophthalmology and podiatry referrals

**🚨 Emergency & Acute Management:**

**Acute decompensated HF in diabetes:**
- **Diuretics**: Furosemide IV (monitor for prerenal AKI)
- **Glucose management**: Insulin sliding scale, avoid metformin during hospitalization
- **Avoid**: Thiazolidinediones (fluid retention), NSAIDs
- **Monitor**: Hourly I/O, daily weights, BID glucose checks

**Hypoglycemia risk factors:**
- Reduced oral intake during HF exacerbations
- ACE-I may potentiate insulin sensitivity
- Coordinate with endocrinology for insulin adjustments

**🎯 Quality Outcomes & Patient Education:**
- Target LVEF improvement >10% at 6 months
- HbA1c <7% (or <8% if elderly/multiple comorbidities)
- Patient education on: daily weights, medication compliance, dietary sodium restriction
- Palliative care consultation if advanced HF with poor diabetes control`,
        sender: 'assistant',
        timestamp: new Date(),
        sources: activeAll.map(space => ({
          spaceId: space.id,
          spaceName: space.name,
          relevance: (space.id === 'mo3' || space.id === 'mo4') ? 'high' as const : 'medium' as const
        })),
        actions: [
          { id: 'save-integrated', label: 'Save Integrated Protocol', action: 'save_integrated_protocol', variant: 'primary' },
          { id: 'generate-care-plan', label: 'Generate Care Plan', action: 'generate_care_plan', variant: 'secondary' },
          { id: 'consult-cardiology', label: 'Request Live Consult', action: 'request_consult', variant: 'ghost' }
        ]
      }
      setMessages(prev => [...prev, comprehensiveResponse])
    }
  }

  const handleQuickReply = (action: string) => {
    if (action === 'show_active') {
      const activePersonal = personalSpaces.filter(s => s.isActive)
      const activeOrg = orgSpaces.filter(s => s.isActive)
      
      let content = `**Active Knowledge Spaces:**

**Personal (${activePersonal.length} active):**
${activePersonal.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n')}

**Organization (${activeOrg.length} active):**
${activeOrg.length > 0 ? activeOrg.map(s => `• ${s.name} (${s.documentCount} documents)`).join('\n') : 'None currently active'}`

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
    } else if (action === 'ask_heart_followup') {
      handleSendMessage('How do we manage heart failure in diabetic patients?')
    }
  }

  const handleAction = (action: string) => {
    if (action === 'include_all_org') {
      const allOrgIds = orgSpaces.map(s => s.id)
      activateOrgSpaces(allOrgIds, (updatedSpaces) => {
        if (currentScenario?.workflowType === 'diabetes') {
          // Show comprehensive diabetes protocol directly
          // Use the updated spaces passed from callback
          const activeOrg = updatedSpaces.filter(s => s.isActive)
          const comprehensiveResponse: ChatMessage = {
            id: `comprehensive-${Date.now()}`,
            content: `**Comprehensive Type 2 Diabetes Management Protocol**
*Based on ${activeOrg.map(s => s.name).join(', ')} - Organization Standards*

**🔍 Initial Assessment & Risk Stratification:**
- HbA1c >7% indicates need for intensified management
- Comprehensive diabetic complications screening:
  - **Retinopathy**: Annual dilated eye exam with ophthalmology
  - **Nephropathy**: Annual microalbumin, eGFR monitoring
  - **Neuropathy**: Annual foot exam with 10g monofilament test
- **Cardiovascular risk assessment**: Calculate 10-year ASCVD risk score
- **Mental health screening**: PHQ-2 for depression (common in T2DM)

**💊 Evidence-Based Treatment Ladder:**

**Step 1 - First-Line (0-3 months):**
- **Metformin** 500mg BID → titrate to 1000mg BID (max 2000mg/day)
- Target HbA1c <7% for most adults (<8% if elderly/comorbid)
- Monitor eGFR baseline and q6 months (contraindicated if <30 mL/min/1.73m²)
- **Lifestyle**: Medical nutrition therapy + 150min/week moderate exercise

**Step 2 - Combination Therapy (if HbA1c >7% after 3 months):**
- **Preferred add-on** (based on patient profile):
  - **SGLT-2 inhibitors** (Empagliflozin 10mg daily): Renal + cardiac protection
  - **GLP-1 agonists** (Semaglutide 0.25mg weekly): Weight loss + CV benefits
  - **DPP-4 inhibitors** (Sitagliptin 100mg daily): Weight neutral, low hypoglycemia risk

**Step 3 - Intensification:**
- **Basal insulin** (Glargine) starting 10 units at bedtime OR 0.2 units/kg
- Titrate by 2-4 units every 3 days based on fasting glucose target 80-130mg/dL

**📊 Monitoring & Follow-up:**
- **HbA1c**: Every 3 months until target achieved, then every 6 months
- **Blood pressure**: Target <140/90 (or <130/80 if high CV risk)
- **Lipids**: Statin therapy if LDL >70mg/dL or high CV risk
- **Weight management**: Document BMI and waist circumference quarterly

**🚨 Emergency Management:**
- **Severe hypoglycemia**: Glucagon 1mg IM/SC if unconscious
- **DKA warning signs**: pH <7.3, glucose >250mg/dL, ketones positive
- **Sick day management**: Continue metformin, increase glucose monitoring

**🎯 Quality Measures:**
- Annual comprehensive foot exam and patient education
- Annual influenza vaccination (increased infection risk)
- Pneumococcal vaccination if ≥65 years or high-risk comorbidities`,
            sender: 'assistant',
            timestamp: new Date(),
            sources: activeOrg.map(space => ({
              spaceId: space.id,
              spaceName: space.name,
              relevance: 'high' as const
            })),
            actions: [
              { id: 'save-protocol', label: 'Save to My Notes', action: 'save_to_notes', variant: 'primary' },
              { id: 'view-complications', label: 'View Complications Management', action: 'view_complications', variant: 'secondary' },
              { id: 'ask-followup', label: 'Ask Follow-up Question', action: 'ask_followup', variant: 'ghost' }
            ]
          }
          setMessages(prev => [...prev, comprehensiveResponse])
        }
      })
    } else if (action === 'include_cardiology_spaces') {
      // Activate cardiology spaces and show comprehensive response when done
      activateOrgSpaces(['mo3'], (updatedOrgSpaces) => {
        activateSharedSpaces(['mo4'], (updatedSharedSpaces) => {
          // Use the updated spaces passed from callback
          const activeAll = [...personalSpaces, ...updatedOrgSpaces, ...updatedSharedSpaces].filter(s => s.isActive)
        
        const comprehensiveResponse: ChatMessage = {
          id: `heart-comprehensive-${Date.now()}`,
          content: `**🫀 Comprehensive Heart Failure Management in Diabetic Patients**
*Integrating Diabetes Management + Cardiology Guidelines + Peer Case Studies*

**🔬 Advanced Risk Stratification:**
- **Diabetic cardiomyopathy assessment**: Echo with strain imaging, diastolic function evaluation
- **Biomarkers**: NT-proBNP >125 pg/mL (adjust for eGFR), Troponin for acute events
- **Coronary evaluation**: Stress testing or CTA if intermediate risk, consider FFR
- **Nephro-cardiac axis**: eGFR, proteinuria, cystatin C for refined risk assessment

**💊 Evidence-Based Integrated Pharmacotherapy:**

**Foundation Therapy (GDMT):**
- **ACE-I/ARB**: Lisinopril 10mg daily → target 40mg daily (dual benefit: diabetic nephropathy + HFrEF)
- **Beta-blocker**: Metoprolol succinate 25mg BID → target 200mg BID (carvedilol alternative if diabetes control issues)
- **MRA**: Spironolactone 25mg daily (monitor K+ closely with diabetes)

**Diabetes-Optimized Add-ons:**
- **SGLT-2 inhibitors**: Empagliflozin 10mg daily (HFrEF benefit independent of diabetes status)
- **GLP-1 agonists**: Semaglutide 1mg weekly (if BMI >30, proven CV outcomes)
- **Metformin**: Continue unless eGFR <30 or hemodynamic instability

**Device/Advanced Therapy Considerations:**
- **ICD**: Primary prevention if LVEF ≤35% despite 3 months optimal medical therapy
- **CRT**: If QRS >150ms with LBBB morphology
- **Heart transplant evaluation**: If refractory HF, but diabetes control must be optimized

**🔄 Integrated Monitoring Protocol:**

**Weekly (during uptitration):**
- Weight, symptoms, blood pressure, heart rate
- Basic metabolic panel (K+, Cr, eGFR)
- Glucose logs review

**Monthly (first 3 months):**
- HbA1c, comprehensive metabolic panel
- Echo if symptoms change
- Medication adherence and side effect assessment

**Quarterly (stable patients):**
- HbA1c, lipid panel, microalbumin
- Echo, 6-minute walk test
- Ophthalmology and podiatry referrals

**🚨 Emergency & Acute Management:**

**Acute decompensated HF in diabetes:**
- **Diuretics**: Furosemide IV (monitor for prerenal AKI)
- **Glucose management**: Insulin sliding scale, avoid metformin during hospitalization
- **Avoid**: Thiazolidinediones (fluid retention), NSAIDs
- **Monitor**: Hourly I/O, daily weights, BID glucose checks

**Hypoglycemia risk factors:**
- Reduced oral intake during HF exacerbations
- ACE-I may potentiate insulin sensitivity
- Coordinate with endocrinology for insulin adjustments

**🎯 Quality Outcomes & Patient Education:**
- Target LVEF improvement >10% at 6 months
- HbA1c <7% (or <8% if elderly/multiple comorbidities)
- Patient education on: daily weights, medication compliance, dietary sodium restriction
- Palliative care consultation if advanced HF with poor diabetes control`,
          sender: 'assistant',
          timestamp: new Date(),
          sources: activeAll.map(space => ({
            spaceId: space.id,
            spaceName: space.name,
            relevance: (space.id === 'mo3' || space.id === 'mo4') ? 'high' as const : 'medium' as const
          })),
          actions: [
            { id: 'save-integrated', label: 'Save Integrated Protocol', action: 'save_integrated_protocol', variant: 'primary' },
            { id: 'generate-care-plan', label: 'Generate Care Plan', action: 'generate_care_plan', variant: 'secondary' },
            { id: 'consult-cardiology', label: 'Request Live Consult', action: 'request_consult', variant: 'ghost' }
          ]
        }
        setMessages(prev => [...prev, comprehensiveResponse])
        })
      })
    } else if (action === 'select_cardiology') {
      activateOrgSpaces(['mo3'])
    } else if (action === 'select_peer') {
      activateSharedSpaces(['mo4'])
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
    setSharedSpaces([])
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
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Personal Section */}
          <div>
            <button 
              onClick={() => setIsPersonalExpanded(!isPersonalExpanded)}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-gray-900">My Space</h2>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${isPersonalExpanded ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isPersonalExpanded && (
              <div className="ml-9 mt-2 space-y-1">
                {personalSpaces.map(space => (
                  <div key={space.id} className="flex items-center justify-between p-2 text-sm">
                    <span className="text-gray-700">{space.name}</span>
                    <div className={`w-6 h-3 rounded-full flex items-center ${
                      space.isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full bg-white transition-transform ${
                        space.isActive ? 'translate-x-3' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organization Section */}
          {orgSpaces.some(space => space.isActive) && (
            <div>
              <button 
                onClick={() => setIsOrgExpanded(!isOrgExpanded)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-medium text-gray-900">Company Spaces</h2>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOrgExpanded ? 'rotate-180' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isOrgExpanded && (
                <div className="ml-9 mt-2 space-y-1">
                  {orgSpaces.filter(space => space.isActive).map(space => (
                    <div key={space.id} className="flex items-center justify-between p-2 text-sm">
                      <span className="text-gray-700">{space.name}</span>
                      <div className="w-6 h-3 rounded-full flex items-center bg-green-600">
                        <div className="w-2 h-2 rounded-full bg-white translate-x-3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shared Spaces Section */}
          <div>
            <button 
              onClick={() => setIsSharedExpanded(!isSharedExpanded)}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-gray-900">Shared Spaces</h2>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${isSharedExpanded ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isSharedExpanded && (
              <div className="ml-9 mt-2 space-y-1">
                {sharedSpaces.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No shared spaces available
                  </div>
                ) : (
                  sharedSpaces.filter(space => space.isActive).map(space => (
                    <div key={space.id} className="flex items-center justify-between p-2 text-sm">
                      <span className="text-gray-700">{space.name}</span>
                      <div className="w-6 h-3 rounded-full flex items-center bg-purple-600">
                        <div className="w-2 h-2 rounded-full bg-white translate-x-3" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Healthcare Assistant v2</h2>
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