import React from 'react';
import { useParams } from 'react-router-dom';
import AccountPlanning from '../AccountPlanning';
import { AccountPlan } from '../types';

export default function AccountPlanningPage() {
  const { accountId } = useParams<{ accountId: string }>();

  const handleSave = (plan: AccountPlan) => {
    console.log('Account Plan Updated:', plan);
    // Here you would typically save the plan to your backend
  };

  return (
    <AccountPlanning
      accountId={accountId || 'demo-account'}
      accountName={accountId ? `Account ${accountId}` : 'Demo Account'}
      onSave={handleSave}
    />
  );
}
