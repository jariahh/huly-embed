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
import { HulyMyIssues } from '../components/HulyMyIssues.js';
import { HulyMilestones } from '../components/HulyMilestones.js';
import { HulyMilestoneDetail } from '../components/HulyMilestoneDetail.js';
import { HulyComponents } from '../components/HulyComponents.js';
import { HulyIssueTemplates } from '../components/HulyIssueTemplates.js';
import { HulyIssuePreview } from '../components/HulyIssuePreview.js';
import { HulyTimeReports } from '../components/HulyTimeReports.js';
import { HulyCreateProject } from '../components/HulyCreateProject.js';
import { HulyDocument } from '../components/HulyDocument.js';
import { HulyDocumentList } from '../components/HulyDocumentList.js';
import { HulyCreateDocument } from '../components/HulyCreateDocument.js';
import { HulyFileBrowser } from '../components/HulyFileBrowser.js';
import { HulyFileDetail } from '../components/HulyFileDetail.js';
import { HulyThread } from '../components/HulyThread.js';
import { HulyActivity } from '../components/HulyActivity.js';
import { HulyCalendar } from '../components/HulyCalendar.js';
import { HulyBoard } from '../components/HulyBoard.js';
import { HulyDepartmentStaff } from '../components/HulyDepartmentStaff.js';
import { HulyTodos } from '../components/HulyTodos.js';
import { HulyMyLeads } from '../components/HulyMyLeads.js';
import { HulyApplications } from '../components/HulyApplications.js';

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

  // ── Original 5 components ──

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

  // ── New 21 components ──

  it('HulyMyIssues passes component="my-issues"', async () => {
    render(<Wrapper><HulyMyIssues /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'my-issues');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'my-issues' }));
  });

  it('HulyMilestones passes component="milestones"', async () => {
    render(<Wrapper><HulyMilestones /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'milestones');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'milestones' }));
  });

  it('HulyMilestoneDetail passes component="milestone-detail" with extraParams', async () => {
    render(<Wrapper><HulyMilestoneDetail milestoneId="MS-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'milestone-detail');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'milestone-detail',
      extraParams: expect.objectContaining({ milestone: 'MS-1' }),
    }));
  });

  it('HulyComponents passes component="components"', async () => {
    render(<Wrapper><HulyComponents /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'components');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'components' }));
  });

  it('HulyIssueTemplates passes component="issue-templates"', async () => {
    render(<Wrapper><HulyIssueTemplates /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'issue-templates');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'issue-templates' }));
  });

  it('HulyIssuePreview passes component="issue-preview" and issue=issueId', async () => {
    render(<Wrapper><HulyIssuePreview issueId="ISS-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'issue-preview');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'issue-preview',
      issue: 'ISS-1',
    }));
  });

  it('HulyTimeReports passes component="time-reports" and issue=issueId', async () => {
    render(<Wrapper><HulyTimeReports issueId="ISS-2" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'time-reports');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'time-reports',
      issue: 'ISS-2',
    }));
  });

  it('HulyCreateProject passes component="create-project"', async () => {
    render(<Wrapper><HulyCreateProject /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'create-project');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'create-project' }));
  });

  it('HulyDocument passes component="document" with extraParams', async () => {
    render(<Wrapper><HulyDocument documentId="DOC-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'document');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'document',
      extraParams: expect.objectContaining({ document: 'DOC-1' }),
    }));
  });

  it('HulyDocumentList passes component="document-list"', async () => {
    render(<Wrapper><HulyDocumentList /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'document-list');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'document-list' }));
  });

  it('HulyCreateDocument passes component="create-document"', async () => {
    render(<Wrapper><HulyCreateDocument /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'create-document');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'create-document' }));
  });

  it('HulyFileBrowser passes component="file-browser"', async () => {
    render(<Wrapper><HulyFileBrowser /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'file-browser');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'file-browser' }));
  });

  it('HulyFileDetail passes component="file-detail" with extraParams', async () => {
    render(<Wrapper><HulyFileDetail fileId="FILE-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'file-detail');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'file-detail',
      extraParams: expect.objectContaining({ file: 'FILE-1' }),
    }));
  });

  it('HulyThread passes component="thread" with extraParams', async () => {
    render(<Wrapper><HulyThread threadId="THR-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'thread');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'thread',
      extraParams: expect.objectContaining({ thread: 'THR-1' }),
    }));
  });

  it('HulyActivity passes component="activity" and issue=issueId', async () => {
    render(<Wrapper><HulyActivity issueId="ISS-3" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'activity');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'activity',
      issue: 'ISS-3',
    }));
  });

  it('HulyCalendar passes component="calendar"', async () => {
    render(<Wrapper><HulyCalendar /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'calendar');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'calendar' }));
  });

  it('HulyBoard passes component="board"', async () => {
    render(<Wrapper><HulyBoard /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'board');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'board' }));
  });

  it('HulyDepartmentStaff passes component="department-staff" with extraParams', async () => {
    render(<Wrapper><HulyDepartmentStaff departmentId="DEPT-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'department-staff');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'department-staff',
      extraParams: expect.objectContaining({ department: 'DEPT-1' }),
    }));
  });

  it('HulyTodos passes component="todos"', async () => {
    render(<Wrapper><HulyTodos /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'todos');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'todos' }));
  });

  it('HulyMyLeads passes component="my-leads"', async () => {
    render(<Wrapper><HulyMyLeads /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'my-leads');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({ component: 'my-leads' }));
  });

  it('HulyApplications passes component="applications" with extraParams', async () => {
    render(<Wrapper><HulyApplications applicationId="APP-1" space="space-1" /></Wrapper>);
    await vi.waitFor(() => {
      expect(mockFetchToken).toHaveBeenCalledWith('https://api.test/token', 'applications');
    });
    expect(mockBuildUrl).toHaveBeenCalledWith(expect.objectContaining({
      component: 'applications',
      extraParams: expect.objectContaining({ application: 'APP-1', space: 'space-1' }),
    }));
  });
});
