import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError, searchCountries } from '../src/api.js';

describe('searchCountries', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('возвращает пустой массив при статусе 404 без выбрасывания ошибки', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));

    const result = await searchCountries('nonexistent');
    expect(result).toEqual([]);
  });

  it('бросает HttpError со статусом при ответе 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    await expect(searchCountries('spain')).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
    await expect(searchCountries('spain')).rejects.toBeInstanceOf(HttpError);
  });
});
