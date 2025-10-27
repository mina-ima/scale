import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  initialActiveTabId?: string;
}

const Tabs: React.FC<TabsProps> = ({ items, initialActiveTabId }) => {
  console.log('Tabs component received items:', items);
  const [activeTabId, setActiveTabId] = useState(
    initialActiveTabId || items[0]?.id
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (
      initialActiveTabId &&
      items.some((item) => item.id === initialActiveTabId)
    ) {
      setActiveTabId(initialActiveTabId);
    } else if (items.length > 0) {
      setActiveTabId(items[0].id);
    }
  }, [items, initialActiveTabId]);

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let newIndex = index;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % items.length;
        break;
      case 'ArrowLeft':
        newIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTabId(items[newIndex].id);
    tabRefs.current[newIndex]?.focus();
  };

  const activeItem = items.find((item) => item.id === activeTabId);

  return (
    <div>
      <div role="tablist" className="flex border-b border-gray-200">
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            aria-selected={activeTabId === item.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={activeTabId === item.id ? 0 : -1}
            onClick={() => handleTabClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`py-2 px-4 text-sm font-medium ${activeTabId === item.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeItem && (
          <div
            key={activeItem.id}
            id={`panel-${activeItem.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeItem.id}`}
            className="h-full"
          >
            {activeItem.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
