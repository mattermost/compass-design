import { describe, expect, it } from 'vitest';
import {
  applyComposerSuggestion,
  findComposerTrigger,
} from './composerTrigger';

const at = (text: string, caret = text.length, opts = {}) =>
  findComposerTrigger(text, caret, opts);

describe('findComposerTrigger', () => {
  it('finds each trigger with its query', () => {
    expect(at('@al')).toEqual({ trigger: '@', start: 0, query: 'al' });
    expect(at('hi ~dev')).toEqual({ trigger: '~', start: 3, query: 'dev' });
    expect(at('go :ro')).toEqual({ trigger: ':', start: 3, query: 'ro' });
    expect(at('/aw')).toEqual({ trigger: '/', start: 0, query: 'aw' });
  });

  it('opens on the bare trigger, except : which needs two characters', () => {
    expect(at('hi @')?.query).toBe('');
    expect(at('~')?.query).toBe('');
    expect(at('/')?.query).toBe('');
    expect(at('hi :')).toBeNull();
    expect(at('hi :r')).toBeNull();
    expect(at('hi :ro')?.query).toBe('ro');
  });

  it('ignores triggers inside a word, such as emails and URLs', () => {
    expect(at('mail me@example.com')).toBeNull();
    expect(at('see http://x')).toBeNull();
    expect(at('a~b')).toBeNull();
  });

  it('only opens / at the start of the text', () => {
    expect(at('see /away')).toBeNull();
    expect(at(' /away')).toBeNull();
    expect(at('/away')).not.toBeNull();
  });

  it('closes after whitespace and follows the caret, not the end', () => {
    expect(at('@alice ')).toBeNull();
    expect(at('@alice bob')).toBeNull();
    expect(at('@alice bob', 3)).toEqual({
      trigger: '@',
      start: 0,
      query: 'al',
    });
    expect(at('line one\n@a')?.start).toBe(9);
    expect(at('@a\nb')).toBeNull();
  });

  it('keeps an outer trigger when a : appears in its query', () => {
    expect(at('@a:bc')).toEqual({ trigger: '@', start: 0, query: 'a:bc' });
  });

  it('honors the triggers and minQueryLength options', () => {
    expect(at('@a', undefined, { triggers: ['~'] })).toBeNull();
    expect(at(':r', undefined, { minQueryLength: { ':': 1 } })).not.toBeNull();
  });

  it('rejects an out of range caret', () => {
    expect(at('@a', 9)).toBeNull();
    expect(at('@a', -1)).toBeNull();
  });
});

describe('applyComposerSuggestion', () => {
  const match = { trigger: '@' as const, start: 3, query: 'al' };

  it('replaces the trigger and query and adds a space', () => {
    expect(applyComposerSuggestion('hi @al', match, 6, '@alice')).toEqual({
      text: 'hi @alice ',
      caret: 10,
    });
  });

  it('keeps text after the caret and does not double an existing space', () => {
    expect(applyComposerSuggestion('hi @al there', match, 6, '@alice')).toEqual(
      {
        text: 'hi @alice there',
        caret: 10,
      },
    );
  });

  it('adds a space before a word that touches the caret', () => {
    expect(applyComposerSuggestion('hi @alx', match, 6, '@alice')).toEqual({
      text: 'hi @alice x',
      caret: 10,
    });
  });

  it('does not add a space when the insert already ends in whitespace', () => {
    expect(applyComposerSuggestion('hi @al', match, 6, '@alice ').text).toBe(
      'hi @alice ',
    );
  });
});
