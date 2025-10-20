'use client';

import { useState } from 'react';
import { Layers, Palette, FileText, Download, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionManager from './SectionManager';
import StyleCustomizer from './StyleCustomizer';
import TemplateSelector from './TemplateSelector';
import ExportControls from './ExportControls';
import HistoryControls from './HistoryControls';

type EditorTab = 'sections' | 'style' | 'templates' | 'export';

interface EditorPanelProps {
  className?: string;
}

/**
 * Editor Panel Component
 * Left sidebar with tabs for managing resume content, style, templates, and export
 */
export default function EditorPanel({ className = '' }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('sections');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'sections' as EditorTab, label: 'Sections', icon: Layers },
    { id: 'style' as EditorTab, label: 'Style', icon: Palette },
    { id: 'templates' as EditorTab, label: 'Templates', icon: FileText },
    { id: 'export' as EditorTab, label: 'Export', icon: Download },
  ];

  return (
    <div
      className={`editor-panel bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } ${className}`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 z-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 shadow-md"
        title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* History Controls */}
      {!isCollapsed && <HistoryControls />}

      {/* Tabs */}
      <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'} border-b border-gray-200`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              } ${isCollapsed ? 'justify-center w-full' : 'flex-1 justify-center'}`}
              title={tab.label}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
          {activeTab === 'sections' && <SectionManager />}
          {activeTab === 'style' && <StyleCustomizer />}
          {activeTab === 'templates' && <TemplateSelector />}
          {activeTab === 'export' && <ExportControls />}
        </div>
      )}
    </div>
  );
}
