import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { HulyEmbedProvider } from '../context/HulyEmbedProvider.js';

vi.mock('@huly-embed/core', async () => {
  const actual = await vi.importActual<typeof import('@huly-embed/core')>('@huly-embed/core');
  return {
    ...actual,
    fetchEmbedToken: vi.fn(),
    buildEmbedUrl: vi.fn(),
    createTokenRefresher: vi.fn(),
    getParentOrigin: vi.fn().mockReturnValue('https://parent.test'),
    isHulyMessage: vi.fn(),
    parseHulyMessage: vi.fn(),
  };
});

import { fetchEmbedToken, buildEmbedUrl, createTokenRefresher } from '@huly-embed/core';
import { HulyCreateIssue } from '../components/HulyCreateIssue.js';
import { HulyIssueList } from '../components/HulyIssueList.js';
import { HulyIssueDetail } from '../components/HulyIssueDetail.js';
import { HulyKanban } from '../components/HulyKanban.js';
import { HulyComments } from '../components/HulyComments.js';

const mockFetchToken = vi.mocked(fetchEmbedToken);
const mockBuildUrl = vi.mocked(buildEmbedUrl);
const mockCreateRefresher = vi.mocked(createTokenRefresher);

const config = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(HulyEmbedProvider, { config }, children);
}

describe('Thin wrapper components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchToken.mockResolvedValue({ token: 'test-token', expiresIn: 3600 });
    mockBuildUrl.mockReturnValue('https://huly.test/embed?token=test');
    mockCreateRefresher.mockReturnValue(vi.fn());
  });

  it('HulyCreateIssue passes component="create-issue"', async () => {
    render(<Wrapper><HulyCreateIssue /></Wrapper>);

    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'create-issue');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'create-issue' }));
  });

  it('HulyIssueList passes component="issue-list"', async () => {
    render(<Wrapper><HulyIssueList /></Wrapper>);

    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'issue-list');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'issue-list' }));
  });

  it('HulyIssueDetail passes component="issue-detail" and issue=issueId', async () => {
    render(<Wrapper><HulyIssueDetail issueId="ISSUE-123" /></Wrapper>);

    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'issue-detail');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'issue-detail',
      issue: 'ISSUE-123',
    }));
  });

  it('HulyKanban passes component="kanban"', async () => {
    render(<Wrapper><HulyKanban /></Wrapper>);

    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'kanban');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'kanban' }));
  });

  it('HulyComments passes component="comments" and issue=issueId', async () => {
    render(<Wrapper><HulyComments issueId="ISSUE-456" /></Wrapper>);

    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'comments');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'comments',
      issue: 'ISSUE-456',
    }));
  });
});
