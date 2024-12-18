export const DEVOPS_STAGES = [
  'Plan',
  'Create',
  'Verify',
  'Package',
  'Release',
  'Configure',
  'Monitor',
  'Secure'
] as const;

export const INFLUENCE_LEVELS = ['High', 'Medium', 'Low'] as const;

export const SENTIMENT_TYPES = ['Promoter', 'Neutral', 'Detractor'] as const;

export const EXTERNAL_INFLUENCER_TYPES = [
  'Analyst',
  'Partner',
  'Event',
  'Publication',
  'UserGroup'
] as const;

export const ACTION_STATUS = [
  'Not Started',
  'In Progress',
  'Completed'
] as const;

export const INITIAL_ACCOUNT_PLAN = {
  id: '',
  accountId: '',
  accountName: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  profile: {
    id: '',
    organizationGoals: [],
    macroEnvironmentFactors: [],
    competitors: [],
    businessRisks: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    },
    itStrategy: {
      supportLevel: 'Enabling' as const,
      details: ''
    },
    digitalTransformation: {
      strategy: '',
      businessObjectiveAlignment: ''
    },
    productUsage: {
      currentView: '',
      customerSince: new Date(),
      annualSpend: 0,
      currentStages: [],
      expansionOpportunities: []
    }
  },
  relationshipMap: {
    id: '',
    contacts: [],
    externalInfluencers: []
  },
  whitespaceMap: {
    id: '',
    technologyStack: [],
    businessOutcomes: [],
    improvementAreas: []
  },
  actionPlan: {
    id: '',
    objectives: []
  }
};
