import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tabs from './Tabs';

describe('Tabs', () => {
  it('should render tabs with correct labels', () => {
    render(
      <Tabs
        tabs={[
          { label: 'Tab 1', content: <div>Content 1</div> },
          { label: 'Tab 2', content: <div>Content 2</div> },
        ]}
        activeTab={0}
        onTabChange={() => {}}
      />
    );
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
  });

  it('should display the content of the active tab', () => {
    render(
      <Tabs
        tabs={[
          { label: 'Tab 1', content: <div>Content 1</div> },
          { label: 'Tab 2', content: <div>Content 2</div> },
        ]}
        activeTab={0}
        onTabChange={() => {}}
      />
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });
});
