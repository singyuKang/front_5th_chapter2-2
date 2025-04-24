import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import useLocalStorage from '../../refactoring/hooks/useLocalStorage';

describe('useLocalStorage 테스트', () => {
  test('저장된 값 사용 테스트', () => {
    const mockSetItem = vi.fn();
    const mockGetItem = vi.fn().mockReturnValue(JSON.stringify('stored value'));

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    });

    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    expect(result.current[0]).toBe('stored value');
    expect(mockGetItem).toHaveBeenCalledWith('key');
  });

  test('setValue 함수가 값을 업데이트하고 localStorage에 저장', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial value'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify('new value'),
    );
  });
});
