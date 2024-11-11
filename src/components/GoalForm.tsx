import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { KPI } from '../types';

interface GoalFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    startDate?: string;
    dueDate?: string;
    kpis: KPI[];
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    startDate?: string;
    dueDate?: string;
    kpis: KPI[];
  };
}

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [kpis, setKpis] = useState<KPI[]>(initialData?.kpis || []);

  const handleAddKPI = () => {
    setKpis([
      ...kpis,
      {
        id: crypto.randomUUID(),
        metric: '',
        target: 0,
        unit: '',
        current: 0
      }
    ]);
  };

  const handleRemoveKPI = (id: string) => {
    setKpis(kpis.filter(kpi => kpi.id !== id));
  };

  const handleUpdateKPI = (id: string, field: keyof KPI, value: string | number) => {
    setKpis(kpis.map(kpi =>
      kpi.id === id ? { ...kpi, [field]: value } : kpi
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      kpis: kpis.filter(kpi => kpi.metric && kpi.target > 0)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          목표 제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            마감일
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            KPI 지표
          </label>
          <button
            type="button"
            onClick={handleAddKPI}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            KPI 추가
          </button>
        </div>
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={kpi.metric}
                  onChange={(e) => handleUpdateKPI(kpi.id, 'metric', e.target.value)}
                  placeholder="지표명"
                  className="w-full p-2 border border-gray-200 rounded-lg mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={(e) => handleUpdateKPI(kpi.id, 'target', parseFloat(e.target.value))}
                      placeholder="목표값"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={kpi.unit}
                      onChange={(e) => handleUpdateKPI(kpi.id, 'unit', e.target.value)}
                      placeholder="단위"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={kpi.current}
                      onChange={(e) => handleUpdateKPI(kpi.id, 'current', parseFloat(e.target.value))}
                      placeholder="현재값"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveKPI(kpi.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
        >
          저장
        </button>
      </div>
    </form>
  );
}