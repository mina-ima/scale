import React from 'react';

interface TabProps {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabProps[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div role="tablist" className="tabs tabs-boxed">
        {tabs.map((tab, index) => (
          <a
            key={index}
            role="tab"
            className={`tab ${index === activeTab ? 'tab-active' : ''}`}
            onClick={() => onTabChange(index)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="py-4">{tabs[activeTab] && tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
