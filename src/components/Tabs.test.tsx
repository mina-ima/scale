import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tabs from './Tabs';

describe('Tabs', () => {
  const tabItems = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];

  it('should render tabs with correct labels', () => {
    render(<Tabs items={tabItems} />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
  });

  it('should display the content of the initially active tab', async () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab2" />);
    expect(await screen.findByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 1')).not.toBeVisible();
  });

  it('should switch to the clicked tab and display its content', () => {
    render(<Tabs items={tabItems} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 1')).not.toBeVisible();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('should handle keyboard navigation (ArrowRight)', () => {
    render(<Tabs items={tabItems} />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    expect(tab2).toHaveFocus();
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
  });

  it('should handle keyboard navigation (ArrowLeft)', () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab2" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
    expect(tab1).toHaveFocus();
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
  });

  it('should loop focus from last tab to first tab with ArrowRight', () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab3" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

    tab3.focus();
    fireEvent.keyDown(tab3, { key: 'ArrowRight' });
    expect(tab1).toHaveFocus();
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
  });

  it('should loop focus from first tab to last tab with ArrowLeft', () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab1" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
    expect(tab3).toHaveFocus();
    expect(tab3).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
  });

  it('should handle Home key to focus the first tab', () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab2" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'Home' });
    expect(tab1).toHaveFocus();
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
  });

  it('should handle End key to focus the last tab', () => {
    render(<Tabs items={tabItems} initialActiveTabId="tab1" />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'End' });
    expect(tab3).toHaveFocus();
    expect(tab3).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
  });

  it('should not unmount content when switching tabs', () => {
    render(<Tabs items={tabItems} />);
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content for Tab 2')).toBeVisible();
    expect(screen.getByText('Content for Tab 1')).not.toBeVisible();
    expect(screen.getByText('Content for Tab 3')).not.toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.getByText('Content for Tab 3')).toBeVisible();
    expect(screen.getByText('Content for Tab 1')).not.toBeVisible();
    expect(screen.getByText('Content for Tab 2')).not.toBeVisible();
  });
});
