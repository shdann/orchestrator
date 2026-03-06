import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrencyCard } from '../CurrencyCard';
import type { CurrencyRate } from '../../types/poe';

describe('CurrencyCard Component', () => {
  const mockRate: CurrencyRate = {
    id: 'chaos-orb',
    name: 'Chaos Orb',
    shortName: 'Chaos',
    chaosValue: 1.0,
    divineValue: 0.0067,
    change24h: 2.5,
    tradeType: 'currency',
    iconUrl: '/chaos.png',
  };

  it('renders correctly', () => {
    const { container } = render(<CurrencyCard rate={mockRate} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays currency name', () => {
    render(<CurrencyCard rate={mockRate} />);
    const name = screen.getByText('Chaos Orb');
    expect(name).toBeInTheDocument();
  });

  it('displays short name fallback when no icon', () => {
    const noIconRate: CurrencyRate = {
      ...mockRate,
      iconUrl: '',
    };

    render(<CurrencyCard rate={noIconRate} />);
    const shortName = screen.getByText('CH');
    expect(shortName).toBeInTheDocument();
  });

  it('displays chaos value', () => {
    render(<CurrencyCard rate={mockRate} />);
    const value = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content?.includes('1');
    });
    expect(value).toBeInTheDocument();
  });

  it('displays positive change with + sign', () => {
    render(<CurrencyCard rate={mockRate} />);
    const change = screen.getByText(/\+2\.5%/);
    expect(change).toBeInTheDocument();
  });

  it('displays negative change without + sign', () => {
    const negativeRate: CurrencyRate = {
      ...mockRate,
      change24h: -3.2,
    };

    render(<CurrencyCard rate={negativeRate} />);
    const change = screen.getByText(/-3\.2%/);
    expect(change).toBeInTheDocument();
  });

  it('displays zero change correctly', () => {
    const zeroRate: CurrencyRate = {
      ...mockRate,
      change24h: 0,
    };

    render(<CurrencyCard rate={zeroRate} />);
    const change = screen.getByText(/0\.0%/);
    expect(change).toBeInTheDocument();
  });

  it('displays currency icon', () => {
    render(<CurrencyCard rate={mockRate} />);
    const icon = screen.getByAltText('Chaos Orb');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/chaos.png');
  });

  it('applies highlight styles when highlight prop is true', () => {
    const { container } = render(<CurrencyCard rate={mockRate} highlight={true} />);
    expect(container.firstChild).toHaveClass('bg-yellow-900/30');
  });

  it('does not apply highlight styles by default', () => {
    const { container } = render(<CurrencyCard rate={mockRate} />);
    expect(container.firstChild).not.toHaveClass('bg-yellow-900/30');
  });

  it('shows divine value for non-Divine currencies', () => {
    render(<CurrencyCard rate={mockRate} />);
    const divineValue = screen.getByText(/≈/);
    expect(divineValue).toBeInTheDocument();
    expect(divineValue).toHaveTextContent(/div/);
  });

  it('does not show divine value for Divine Orb', () => {
    const divineRate: CurrencyRate = {
      id: 'divine-orb',
      name: 'Divine Orb',
      shortName: 'Div',
      chaosValue: 150.5,
      divineValue: 1.0,
      change24h: 2.5,
      tradeType: 'currency',
      iconUrl: '/divine.png',
    };

    render(<CurrencyCard rate={divineRate} />);
    const divineValue = screen.queryByText(/≈/);
    expect(divineValue).not.toBeInTheDocument();
  });

  it('formats large values correctly', () => {
    const largeValueRate: CurrencyRate = {
      ...mockRate,
      chaosValue: 1234.5,
    };

    render(<CurrencyCard rate={largeValueRate} />);
    const value = screen.getByText(/1\.2k/);
    expect(value).toBeInTheDocument();
  });
});
