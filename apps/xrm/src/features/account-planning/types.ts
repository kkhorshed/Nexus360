export interface AccountProfile {
  id: string;
  organizationGoals: {
    goal: string;
    strategicInitiatives: string[];
    valueDrivers: string[];
  }[];
  macroEnvironmentFactors: {
    factor: string;
    impact: string;
    implications: string;
  }[];
  competitors: {
    name: string;
    marketShareStrategy: string;
  }[];
  businessRisks: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  itStrategy: {
    supportLevel: 'Enabling' | 'Hindering';
    details: string;
  };
  digitalTransformation: {
    strategy: string;
    businessObjectiveAlignment: string;
  };
  productUsage: {
    currentView: string;
    customerSince: Date;
    annualSpend: number;
    currentStages: string[];
    expansionOpportunities: string[];
  };
}

export interface RelationshipMap {
  id: string;
  contacts: {
    id: string;
    name: string;
    role: string;
    influence: 'High' | 'Medium' | 'Low';
    sentiment: 'Promoter' | 'Neutral' | 'Detractor';
    businessUnit: string;
    relationships: {
      contactId: string;
      relationshipType: string;
      influence: 'High' | 'Medium' | 'Low';
    }[];
  }[];
  externalInfluencers: {
    type: 'Analyst' | 'Partner' | 'Event' | 'Publication' | 'UserGroup';
    name: string;
    influence: 'High' | 'Medium' | 'Low';
    relatedContacts: string[]; // contact IDs
  }[];
}

export interface WhitespaceMap {
  id: string;
  technologyStack: {
    stage: string;
    currentVendors: {
      name: string;
      annualInvestment: number;
      contractRenewal: Date;
      satisfaction: number;
      painPoints: string[];
    }[];
  }[];
  businessOutcomes: {
    current: string;
    desired: string;
    gap: string;
    impact: string;
  }[];
  improvementAreas: {
    area: string;
    target: string;
    currentMetrics: string;
    desiredMetrics: string;
    obstacles: string[];
  }[];
}

export interface ActionPlan {
  id: string;
  objectives: {
    id: string;
    description: string;
    actions: {
      id: string;
      description: string;
      assignee: string;
      dueDate: Date;
      status: 'Not Started' | 'In Progress' | 'Completed';
      resources: string[];
    }[];
  }[];
}

export interface AccountPlan {
  id: string;
  accountId: string;
  accountName: string;
  createdAt: Date;
  updatedAt: Date;
  profile: AccountProfile;
  relationshipMap: RelationshipMap;
  whitespaceMap: WhitespaceMap;
  actionPlan: ActionPlan;
}
