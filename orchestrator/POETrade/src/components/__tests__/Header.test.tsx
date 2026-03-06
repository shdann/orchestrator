import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../Header';
import type { DataStatus } from '../../hooks/usePoeData';

describe('Header Component', () => {
  const mockOnRefresh = jest.fn();
  const mockOnAlertsClick = jest.fn();
  const mockLastUpdated = new Date('2025-01-01T12:00:00');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    status: 'success' as DataStatus,
    lastUpdated: mockLastUpdated,
    league: 'Mercenaries',
    triggeredAlerts: 0,
    onRefresh: mockOnRefresh,
    onAlertsClick: mockOnAlertsClick,
  };

  it('renders correctly', () => {
    render(<Header {...defaultProps} />);
    const title = screen.getByText('POETrade');
    expect(title).toBeInTheDocument();
  });

  it('displays the league name', () => {
    render(<Header {...defaultProps} league="Standard" />);
    const league = screen.getByText('Standard');
    expect(league).toBeInTheDocument();
  });

  it('displays the last updated time', () => {
    render(<Header {...defaultProps} />);
    const updated = screen.getByText(/Updated:/);
    expect(updated).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<Header {...defaultProps} />);
    const refreshButton = screen.getByLabelText('Refresh data');
    fireEvent.click(refreshButton);
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onAlertsClick when alerts button is clicked', () => {
    render(<Header {...defaultProps} />);
    const alertsButton = screen.getByLabelText('View alerts');
    fireEvent.click(alertsButton);
    expect(mockOnAlertsClick).toHaveBeenCalledTimes(1);
  });

  it('shows triggered alerts count when > 0', () => {
    render(<Header {...defaultProps} triggeredAlerts={3} />);
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('does not show badge when no triggered alerts', () => {
    render(<Header {...defaultProps} triggeredAlerts={0} />);
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('disables refresh button when loading', () => {
    render(<Header {...defaultProps} status="loading" />);
    const refreshButton = screen.getByLabelText('Refresh data');
    expect(refreshButton).toBeDisabled();
  });
});
