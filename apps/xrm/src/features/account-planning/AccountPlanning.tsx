import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';
import { AccountProfile } from './components/AccountProfile';
import { RelationshipMap } from './components/RelationshipMap';
import { WhitespaceMap } from './components/WhitespaceMap';
import { ActionPlan } from './components/ActionPlan';
import { AccountPlan } from './types';
import { INITIAL_ACCOUNT_PLAN } from './constants';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-planning-tabpanel-${index}`}
      aria-labelledby={`account-planning-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `account-planning-tab-${index}`,
    'aria-controls': `account-planning-tabpanel-${index}`,
  };
}

interface AccountPlanningProps {
  accountId: string;
  accountName: string;
  readonly?: boolean;
  onSave?: (plan: AccountPlan) => void;
  initialPlan?: AccountPlan;
}

export default function AccountPlanning({
  accountId,
  accountName,
  readonly = false,
  onSave,
  initialPlan
}: AccountPlanningProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [accountPlan, setAccountPlan] = useState<AccountPlan>(
    initialPlan || {
      ...INITIAL_ACCOUNT_PLAN,
      accountId,
      accountName
    }
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleUpdateProfile = (profile: AccountPlan['profile']) => {
    const updatedPlan = {
      ...accountPlan,
      profile,
      updatedAt: new Date()
    };
    setAccountPlan(updatedPlan);
    onSave?.(updatedPlan);
  };

  const handleUpdateRelationshipMap = (relationshipMap: AccountPlan['relationshipMap']) => {
    const updatedPlan = {
      ...accountPlan,
      relationshipMap,
      updatedAt: new Date()
    };
    setAccountPlan(updatedPlan);
    onSave?.(updatedPlan);
  };

  const handleUpdateWhitespaceMap = (whitespaceMap: AccountPlan['whitespaceMap']) => {
    const updatedPlan = {
      ...accountPlan,
      whitespaceMap,
      updatedAt: new Date()
    };
    setAccountPlan(updatedPlan);
    onSave?.(updatedPlan);
  };

  const handleUpdateActionPlan = (actionPlan: AccountPlan['actionPlan']) => {
    const updatedPlan = {
      ...accountPlan,
      actionPlan,
      updatedAt: new Date()
    };
    setAccountPlan(updatedPlan);
    onSave?.(updatedPlan);
  };

  return (
    <PageWrapper
      title="Account Planning"
      description={`Account plan for ${accountName}`}
    >
      <PageSection>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="account planning tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Account Profile" {...a11yProps(0)} />
              <Tab label="Relationship Map" {...a11yProps(1)} />
              <Tab label="Whitespace Map" {...a11yProps(2)} />
              <Tab label="Action Plan" {...a11yProps(3)} />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <AccountProfile
              profile={accountPlan.profile}
              onUpdate={handleUpdateProfile}
              readonly={readonly}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <RelationshipMap
              relationshipMap={accountPlan.relationshipMap}
              onUpdate={handleUpdateRelationshipMap}
              readonly={readonly}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <WhitespaceMap
              whitespaceMap={accountPlan.whitespaceMap}
              onUpdate={handleUpdateWhitespaceMap}
              readonly={readonly}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <ActionPlan
              actionPlan={accountPlan.actionPlan}
              onUpdate={handleUpdateActionPlan}
              readonly={readonly}
            />
          </TabPanel>
        </Box>
      </PageSection>
    </PageWrapper>
  );
}
