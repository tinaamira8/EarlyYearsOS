import { render, screen } from '@testing-library/react';
import { AppRouter } from './AppRouter';
import { AppView } from './services/types';

describe('AppRouter', () => {
  it('renders NQS Overview for the sidebar NQS view', async () => {
    render(
      <AppRouter
        currentView={AppView.NQS_OVERVIEW}
        user={null}
        navigateTo={() => undefined}
        navigateToPlan={() => undefined}
      />,
    );

    expect(await screen.findByRole('heading', { name: 'NQS Overview' })).toBeInTheDocument();
  });
});
