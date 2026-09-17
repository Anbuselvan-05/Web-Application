import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Employee, DashboardStats } from '../types';

interface HomeProps {
  stats: DashboardStats | null;
  employees: Employee[];
  isLoading: boolean;
  onNavigate: (tab: string) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const Home: React.FC<HomeProps> = (props) => {
  return <Dashboard {...props} />;
};
