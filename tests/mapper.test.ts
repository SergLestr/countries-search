import { describe, expect, it } from 'vitest';
import { mapCountryResponse } from '../src/mapper.js';

describe('mapCountryResponse', () => {
  it('корректно преобразует формат countries.dev с массивами языков и валют', () => {
    const raw = {
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flag: '🇪🇸',
      flags: { svg: 'https://countries.dev' },
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505992,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      languages: [{ code: 'spa', name: 'Spanish' }],
      currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    };

    const mapped = mapCountryResponse(raw);

    expect(mapped).toEqual({
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flagUrl: 'https://countries.dev',
      flagEmoji: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505992,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      languages: ['Spanish'],
      currencies: ['Euro (€)'],
    });
  });

  it('безопасно подставляет значения по умолчанию при отсутствии необязательных полей', () => {
    const mapped = mapCountryResponse({ name: 'UnknownLand' });
    expect(mapped.capital).toBe('Нет столицы');
    expect(mapped.languages).toEqual([]);
    expect(mapped.currencies).toEqual([]);
  });
});
