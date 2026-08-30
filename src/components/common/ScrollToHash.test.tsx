import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollToHash } from '@/components/common/ScrollToHash';

describe('ScrollToHash', () => {
  afterEach(() => {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  it('scrolls the matching element into view when a hash is present', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    render(
      <>
        <div id="faq">FAQ</div>
        <ScrollToHash hash="#faq" />
      </>,
    );

    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('scrolls again when the hash changes', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    const { rerender } = render(
      <>
        <div id="faq">FAQ</div>
        <div id="try">Try it</div>
        <ScrollToHash hash="#faq" />
      </>,
    );

    scrollIntoView.mockClear();

    rerender(
      <>
        <div id="faq">FAQ</div>
        <div id="try">Try it</div>
        <ScrollToHash hash="#try" />
      </>,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('renders nothing when there is no hash', () => {
    const { container } = render(<ScrollToHash hash="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
