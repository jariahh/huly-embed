import { describe, it, expect } from 'vitest';
import { EmbedMessageTypes, isHulyMessage, parseHulyMessage } from '../messages.js';

function makeEvent(data: unknown, origin = 'https://huly.test'): MessageEvent {
  return { data, origin } as MessageEvent;
}

const ALLOWED = ['https://huly.test'];

describe('EmbedMessageTypes', () => {
  it('has all 5 expected message types', () => {
    expect(EmbedMessageTypes.Ready).toBe('huly-embed-ready');
    expect(EmbedMessageTypes.IssueCreated).toBe('huly-embed-issue-created');
    expect(EmbedMessageTypes.IssueSelected).toBe('huly-embed-issue-selected');
    expect(EmbedMessageTypes.Resize).toBe('huly-embed-resize');
    expect(EmbedMessageTypes.Error).toBe('huly-embed-error');
  });
});

describe('isHulyMessage', () => {
  it('returns false when origin is not in allowedOrigins', () => {
    const event = makeEvent({ type: 'huly-embed-ready' }, 'https://evil.com');
    expect(isHulyMessage(event, ALLOWED)).toBe(false);
  });

  it('returns false when data is null', () => {
    expect(isHulyMessage(makeEvent(null), ALLOWED)).toBe(false);
  });

  it('returns false when data is not an object', () => {
    expect(isHulyMessage(makeEvent('string'), ALLOWED)).toBe(false);
    expect(isHulyMessage(makeEvent(42), ALLOWED)).toBe(false);
  });

  it('returns false when data.type is missing', () => {
    expect(isHulyMessage(makeEvent({}), ALLOWED)).toBe(false);
  });

  it('returns false when data.type does not start with huly-embed-', () => {
    expect(isHulyMessage(makeEvent({ type: 'other-event' }), ALLOWED)).toBe(false);
  });

  it('returns false for huly-embed- prefix with unknown suffix', () => {
    expect(isHulyMessage(makeEvent({ type: 'huly-embed-unknown' }), ALLOWED)).toBe(false);
  });

  it('returns true for each valid message type', () => {
    for (const type of Object.values(EmbedMessageTypes)) {
      expect(isHulyMessage(makeEvent({ type }), ALLOWED)).toBe(true);
    }
  });
});

describe('parseHulyMessage', () => {
  it('returns null for non-object data', () => {
    expect(parseHulyMessage(makeEvent('string'))).toBeNull();
  });

  it('returns null for null data', () => {
    expect(parseHulyMessage(makeEvent(null))).toBeNull();
  });

  it('returns null for unknown type', () => {
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-unknown' }))).toBeNull();
  });

  it('parses Ready message', () => {
    const result = parseHulyMessage(makeEvent({ type: 'huly-embed-ready' }));
    expect(result).toEqual({ type: 'huly-embed-ready' });
  });

  it('parses IssueCreated with issueId and identifier', () => {
    const result = parseHulyMessage(
      makeEvent({ type: 'huly-embed-issue-created', issueId: 'id1', identifier: 'TEST-1' })
    );
    expect(result).toEqual({ type: 'huly-embed-issue-created', issueId: 'id1', identifier: 'TEST-1' });
  });

  it('parses IssueCreated with cancelled: true', () => {
    const result = parseHulyMessage(
      makeEvent({ type: 'huly-embed-issue-created', cancelled: true })
    );
    expect(result).toEqual({ type: 'huly-embed-issue-created', cancelled: true });
  });

  it('returns null for IssueCreated with missing fields', () => {
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-issue-created', issueId: 'id1' }))).toBeNull();
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-issue-created' }))).toBeNull();
  });

  it('parses IssueSelected', () => {
    const result = parseHulyMessage(
      makeEvent({ type: 'huly-embed-issue-selected', issueId: 'id2', identifier: 'TEST-2' })
    );
    expect(result).toEqual({ type: 'huly-embed-issue-selected', issueId: 'id2', identifier: 'TEST-2' });
  });

  it('returns null for IssueSelected with missing fields', () => {
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-issue-selected' }))).toBeNull();
  });

  it('parses Resize', () => {
    const result = parseHulyMessage(makeEvent({ type: 'huly-embed-resize', height: 500 }));
    expect(result).toEqual({ type: 'huly-embed-resize', height: 500 });
  });

  it('returns null for Resize with non-number height', () => {
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-resize', height: '500' }))).toBeNull();
  });

  it('parses Error', () => {
    const result = parseHulyMessage(makeEvent({ type: 'huly-embed-error', reason: 'auth-expired' }));
    expect(result).toEqual({ type: 'huly-embed-error', reason: 'auth-expired' });
  });

  it('returns null for Error with missing reason', () => {
    expect(parseHulyMessage(makeEvent({ type: 'huly-embed-error' }))).toBeNull();
  });
});
