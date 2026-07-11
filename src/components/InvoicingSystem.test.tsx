import { fireEvent, render, screen } from '@testing-library/react';
import { InvoicingSystem } from './InvoicingSystem';

describe('InvoicingSystem', () => {
  it('creates a pending invoice from the invoice dialog', () => {
    render(<InvoicingSystem />);

    fireEvent.click(screen.getByRole('button', { name: 'New Invoice' }));
    expect(screen.getByRole('dialog', { name: 'Create invoice' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Family'), { target: { value: 'Wilson Family' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '125' } });
    fireEvent.change(screen.getByLabelText('Due date'), { target: { value: '2026-07-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create invoice' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Wilson Family \$125/ })).toBeInTheDocument();
  });
});
