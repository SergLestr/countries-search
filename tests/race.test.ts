import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSearch } from '../src/search.js';
import { AppState } from '../src/types.js';

describe('Race condition & AbortController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('отменяет первый медленный запрос при новом вводе и не перезаписывает свежий результат', async () => {
    const capturedSignals: AbortSignal[] = [];
    const resolvers: Array<(res: Response) => void> = [];

    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const signal = init?.signal as AbortSignal;
      capturedSignals.push(signal);

      return new Promise<Response>((resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
        resolvers.push(resolve);
      });
    });

    const states: AppState[] = [];
    const search = createSearch((s) => states.push(s), undefined, 300);

    search.input('sp');
    vi.advanceTimersByTime(300);
    expect(capturedSignals).toHaveLength(1);
    expect(capturedSignals[0].aborted).toBe(false);

    search.input('spain');
    expect(capturedSignals[0].aborted).toBe(true);

    vi.advanceTimersByTime(300);
    expect(capturedSignals).toHaveLength(2);
    expect(capturedSignals[1].aborted).toBe(false);

    resolvers[1](
      new Response(JSON.stringify([{ name: 'Spain', capital: 'Madrid' }]), {
        status: 200,
      }),
    );
    await vi.runAllTimersAsync();

    resolvers[0](
      new Response(JSON.stringify([{ name: 'Singapore', capital: 'Singapore' }]), {
        status: 200,
      }),
    );
    await vi.runAllTimersAsync();

    const finalState = search.getState();
    expect(finalState.status).toBe('success');
    if (finalState.status === 'success') {
      expect(finalState.countries).toHaveLength(1);
      expect(finalState.countries[0].name).toBe('Spain');
    }

    expect(states.some((s) => s.status === 'error')).toBe(false);
  });

  it('различает TimeoutError и показывает ошибку пользователю', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new DOMException('The operation timed out', 'TimeoutError'),
    );

    const search = createSearch(() => {}, undefined, 100);
    search.input('spain');
    await vi.advanceTimersByTimeAsync(100);

    const state = search.getState();
    expect(state.status).toBe('error');
  });
});
