import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tabs from './Tabs';

describe('Tabs', () => {
  const mockTabs = [
    { label: 'Tab 1', content: <div>Content of Tab 1</div> },
    { label: 'Tab 2', content: <div>Content of Tab 2</div> },
    { label: 'Tab 3', content: <div>Content of Tab 3</div> },
  ];

  it('renders correctly with initial active tab', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={0} onTabChange={onTabChange} />);

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass(
      'tab-active'
    );
    expect(screen.getByText('Content of Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content of Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content of Tab 3')).toBeInTheDocument();

    expect(screen.getByText('Content of Tab 1')).toBeVisible();
    expect(screen.getByText('Content of Tab 2')).not.toBeVisible();
    expect(screen.getByText('Content of Tab 3')).not.toBeVisible();
  });

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={0} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onTabChange).toHaveBeenCalledWith(1);
  });

  it('navigates with ArrowRight key', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={0} onTabChange={onTabChange} />);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith(1);
  });

  it('navigates with ArrowLeft key', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={1} onTabChange={onTabChange} />);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith(0);

    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith(0);
  });

  it('navigates to the first tab with Home key', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={2} onTabChange={onTabChange} />);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(onTabChange).toHaveBeenCalledWith(0);
  });

  it('navigates to the last tab with End key', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab={0} onTabChange={onTabChange} />);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(onTabChange).toHaveBeenCalledWith(2);
  });

  it('wraps around when navigating with arrow keys', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(
      <Tabs tabs={mockTabs} activeTab={0} onTabChange={onTabChange} />
    );

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith(mockTabs.length - 1);

    onTabChange.mockClear();
    rerender(
      <Tabs
        tabs={mockTabs}
        activeTab={mockTabs.length - 1}
        onTabChange={onTabChange}
      />
    );
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith(0);
  });
});
