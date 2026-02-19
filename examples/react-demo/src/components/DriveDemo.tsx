import { useState } from 'react';
import { HulyFileBrowser, HulyFileDetail } from '@huly-embed/react';

type DriveView = 'file-browser' | 'file-detail';

interface Props {
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function DriveDemo({ externalUser, onEvent }: Props) {
  const [view, setView] = useState<DriveView>('file-browser');
  const [fileId, setFileId] = useState('');
  const [drive, setDrive] = useState('');

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Drive</h2>
      </div>
      <div className="demo-controls">
        <span className="demo-controls-label">View</span>
        <select value={view} onChange={(e) => setView(e.target.value as DriveView)}>
          <option value="file-browser">File Browser</option>
          <option value="file-detail">File Detail</option>
        </select>
        {view === 'file-browser' && (
          <>
            <span className="demo-controls-label">Drive</span>
            <input
              type="text"
              value={drive}
              onChange={(e) => setDrive(e.target.value)}
              placeholder="optional"
            />
          </>
        )}
        {view === 'file-detail' && (
          <>
            <span className="demo-controls-label">File ID</span>
            <input
              type="text"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              placeholder="file-id"
            />
          </>
        )}
      </div>
      <div className="embed-container">
        {view === 'file-browser' && (
          <HulyFileBrowser
            drive={drive || undefined}
            externalUser={externalUser}
            onReady={() => onEvent('file-browser: ready')}
            onFileSelected={(e) => onEvent(`file-selected: ${e.fileId}`)}
            onResize={(e) => onEvent(`${view}: resize ${e.height}px`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading file browser...</div>}
            errorContent={<div className="error-text">Failed to load.</div>}
          />
        )}
        {view === 'file-detail' && (
          fileId ? (
            <HulyFileDetail
              fileId={fileId}
              externalUser={externalUser}
              onReady={() => onEvent(`file-detail: ready (${fileId})`)}
              onResize={(e) => onEvent(`${view}: resize ${e.height}px`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
              loadingContent={<div className="loading-text">Loading file detail...</div>}
              errorContent={<div className="error-text">Failed to load.</div>}
            />
          ) : (
            <div className="empty-state">Enter a file ID above.</div>
          )
        )}
      </div>
    </div>
  );
}
