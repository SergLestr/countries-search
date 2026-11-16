import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../src/debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('вызывает функцию один раз после истечения задержки', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('сбрасывает таймер при повторном вызове до истечения задержки', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('sp');
    vi.advanceTimersByTime(200);
    debounced('spain');
    vi.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('spain');
  });
});
