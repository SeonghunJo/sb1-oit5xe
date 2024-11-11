import React, { useState } from 'react';
import { LayersIcon, Target, Calendar, BarChart } from 'lucide-react';
import { TeamGoal } from '../types';
import { GoalForm } from './GoalForm';

interface TeamGoalsListProps {
  goals: TeamGoal[];
  onSelect: (goal: TeamGoal) => void;
  onShowUnlinked: () => void;
  showingUnlinked: boolean;
  onUpdateGoal?: (goal: TeamGoal) => void;
  isTeamLead?: boolean;
}

export function TeamGoalsList({ 
  goals, 
  onSelect, 
  onShowUnlinked, 
  showingUnlinked,
  onUpdateGoal,
  isTeamLead = false
}: TeamGoalsListProps) {
  const [editingGoal, setEditingGoal] = useState<TeamGoal | null>(null);

  const handleEditGoal = (goal: TeamGoal) => {
    setEditingGoal(goal);
  };

  const handleUpdateGoal = (data: {
    title: string;
    description: string;
    startDate?: string;
    dueDate?: string;
    kpis: any[];
  }) => {
    if (editingGoal && onUpdateGoal) {
      onUpdateGoal({
        ...editingGoal,
        ...data
      });
      setEditingGoal(null);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getKPIProgress = (goal: TeamGoal) => {
    if (!goal.kpis?.length) return null;
    const totalProgress = goal.kpis.reduce((acc, kpi) => {
      return acc + (kpi.current / kpi.target) * 100;
    }, 0);
    return Math.round(totalProgress / goal.kpis.length);
  };

  if (editingGoal) {
    return (
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">목표 수정</h2>
        <GoalForm
          initialData={editingGoal}
          onSubmit={handleUpdateGoal}
          onCancel={() => setEditingGoal(null)}
        />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">팀 목표</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="group text-left p-5 rounded-xl border-2 hover:border-indigo-500 transition-all bg-white hover:shadow-lg relative"
            style={{ borderColor: `${goal.color}30` }}
          >
            <button
              onClick={() => onSelect(goal)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {goal.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
              {(goal.startDate || goal.dueDate) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {goal.startDate && formatDate(goal.startDate)}
                    {goal.startDate && goal.dueDate && ' ~ '}
                    {goal.dueDate && formatDate(goal.dueDate)}
                  </span>
                </div>
              )}
              {goal.kpis?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <BarChart className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {getKPIProgress(goal)}% 달성
                  </span>
                </div>
              )}
            </button>
            {isTeamLead && onUpdateGoal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGoal(goal);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-sm text-indigo-600 hover:text-indigo-700 bg-white px-2 py-1 rounded"
              >
                수정
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onShowUnlinked}
          className={`text-left p-5 rounded-xl border-2 hover:border-indigo-500 transition-all bg-white hover:shadow-lg ${
            showingUnlinked ? 'border-indigo-500' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <LayersIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">기타 작업</h3>
          </div>
          <p className="text-sm text-gray-600">팀 목표와 연결되지 않은 작업 목록</p>
        </button>
      </div>
    </div>
  );
}