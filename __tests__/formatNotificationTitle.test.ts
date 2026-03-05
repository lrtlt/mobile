import {asNotNull} from '../app/util/StringUtils';

describe('asNotNull', () => {
  it('returns the title when it is a valid string', () => {
    expect(asNotNull('Breaking News')).toBe('Breaking News');
  });

  it('returns undefined when title is undefined', () => {
    expect(asNotNull(undefined)).toBeUndefined();
  });

  it('returns undefined when title is the string "null"', () => {
    expect(asNotNull('null')).toBeUndefined();
  });

  it('returns undefined when title is an empty string', () => {
    expect(asNotNull('')).toBeUndefined();
  });

  it('returns the title when it contains whitespace', () => {
    expect(asNotNull(' ')).toBe(' ');
  });

  it('returns the title with special characters', () => {
    expect(asNotNull('Naujienos: LRT žinios!')).toBe('Naujienos: LRT žinios!');
  });
});
