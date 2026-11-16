import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from '../src/api.js';
import { createSearch } from '../src/search.js';
import { AppState } from '../src/types.js';

describe('Error handling in search (AbortError / TimeoutError / HttpError)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('не переводит состояние в error при AbortError (ручная отмена)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new DOMException('Aborted by user', 'AbortError'));
    const states: AppState[] = [];
    const search = createSearch((s) => states.push(s), fetcher, 100);

    search.input('spain');
    await vi.advanceTimersByTimeAsync(100);

    expect(states.some((s) => s.status === 'error')).toBe(false);
  });

  it('показывает ошибку при TimeoutError (таймаут запроса)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError'));
    const search = createSearch(() => {}, fetcher, 100);

    search.input('spain');
    await vi.advanceTimersByTimeAsync(100);

    expect(search.getState().status).toBe('error');
  });

  it('показывает ошибку при HttpError (500)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new HttpError(500));
    const search = createSearch(() => {}, fetcher, 100);

    search.input('spain');
    await vi.advanceTimersByTimeAsync(100);

    const state = search.getState();
    expect(state.status).toBe('error');
    if (state.status === 'error') {
      expect(state.message).toContain('500');
    }
  });
});
