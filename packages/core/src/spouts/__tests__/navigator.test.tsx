/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import React from 'react';

import {
  NavigatorContext,
  parseAcceptLanguage,
  useNavigator,
  type NavigatorProperties,
} from '../navigator.context';

describe('parseAcceptLanguage', () => {
  it('should parse a simple language header', () => {
    const result = parseAcceptLanguage('en-US');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US']);
  });

  it('should parse multiple languages without quality factors', () => {
    const result = parseAcceptLanguage('en-US, fr, de');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', 'fr', 'de']);
  });

  it('should sort languages by quality factor', () => {
    const result = parseAcceptLanguage('en-US;q=0.7, fr;q=0.9, de;q=0.8');
    expect(result.language).toBe('fr');
    expect(result.languages).toEqual(['fr', 'de', 'en-US']);
  });

  it('should handle mixed quality factors (some with, some without)', () => {
    const result = parseAcceptLanguage('en-US, fr;q=0.9, de;q=0.8');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', 'fr', 'de']);
  });

  it('should handle a realistic Accept-Language header', () => {
    const result = parseAcceptLanguage('en-US,en;q=0.9,es;q=0.8,fr;q=0.7');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', 'en', 'es', 'fr']);
  });

  it('should return default "en" for undefined header', () => {
    const result = parseAcceptLanguage(undefined);
    expect(result.language).toBe('en');
    expect(result.languages).toEqual(['en']);
  });

  it('should return default "en" for empty header', () => {
    const result = parseAcceptLanguage('');
    expect(result.language).toBe('en');
    expect(result.languages).toEqual(['en']);
  });

  it('should handle whitespace in header', () => {
    const result = parseAcceptLanguage('  en-US  ,  fr  ;  q=0.5  ');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', 'fr']);
  });

  it('should handle q=1 explicitly', () => {
    const result = parseAcceptLanguage('en-US;q=1, fr;q=0.5');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', 'fr']);
  });

  it('should handle wildcard language', () => {
    const result = parseAcceptLanguage('en-US, *;q=0.1');
    expect(result.language).toBe('en-US');
    expect(result.languages).toEqual(['en-US', '*']);
  });
});

describe('useNavigator', () => {
  it('should return navigator properties when used within context', () => {
    const navigatorProps: NavigatorProperties = {
      language: 'fr-FR',
      languages: ['fr-FR', 'en-US'],
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigatorContext value={navigatorProps}>{children}</NavigatorContext>
    );

    const { result } = renderHook(() => useNavigator(), { wrapper });

    expect(result.current.language).toBe('fr-FR');
    expect(result.current.languages).toEqual(['fr-FR', 'en-US']);
  });

  it('should throw when used outside context', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useNavigator());
    }).toThrow('useNavigator must be used within a NavigatorProvider');

    consoleSpy.mockRestore();
  });
});
