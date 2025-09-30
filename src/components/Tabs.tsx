import React, { useRef, useEffect } from 'react';

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
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Focus the active tab when it changes
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab]?.focus();
    }
  }, [activeTab]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let newIndex = activeTab;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = (activeTab - 1 + tabs.length) % tabs.length;
        break;
      case 'ArrowRight':
        newIndex = (activeTab + 1) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onTabChange(newIndex);
  };

  return (
    <div>
      <div role="tablist" className="tabs tabs-boxed" onKeyDown={handleKeyDown}>
        {tabs.map((tab, index) => (
          <a
            key={index}
            role="tab"
            className={`tab ${index === activeTab ? 'tab-active' : ''}`}
            onClick={() => onTabChange(index)}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            tabIndex={index === activeTab ? 0 : -1}
          >
            {tab.label}
          </a>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={index} role="tabpanel" hidden={index !== activeTab}>
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
