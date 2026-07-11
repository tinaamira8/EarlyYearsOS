import { fireEvent, render, screen } from '@testing-library/react';
import { OccupancyAnalytics } from './OccupancyAnalytics';

describe('OccupancyAnalytics', () => {
  it('updates metrics when the period changes', () => {
    render(<OccupancyAnalytics />);
    expect(screen.getByText('89.2%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next Month' }));

    expect(screen.getByText('93.4%')).toBeInTheDocument();
    expect(screen.getByText('$46.1k')).toBeInTheDocument();
    expect(screen.getByText('Updated for next month')).toBeInTheDocument();
  });
});
