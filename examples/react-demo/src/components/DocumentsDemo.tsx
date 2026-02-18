import { useState } from 'react';
import { HulyDocument, HulyDocumentList, HulyCreateDocument } from '@huly-embed/react';

type DocView = 'document-list' | 'create-document' | 'document';

interface Props {
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function DocumentsDemo({ externalUser, onEvent }: Props) {
  const [view, setView] = useState<DocView>('document-list');
  const [documentId, setDocumentId] = useState('');
  const [space, setSpace] = useState('');

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Documents</h2>
      </div>
      <div className="demo-controls">
        <span className="demo-controls-label">View</span>
        <select value={view} onChange={(e) => setView(e.target.value as DocView)}>
          <option value="document-list">Document List</option>
          <option value="create-document">Create Document</option>
          <option value="document">Document Detail</option>
        </select>
        {view === 'document' && (
          <>
            <span className="demo-controls-label">Document ID</span>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="doc-id"
            />
          </>
        )}
        {view === 'create-document' && (
          <>
            <span className="demo-controls-label">Space</span>
            <input
              type="text"
              value={space}
              onChange={(e) => setSpace(e.target.value)}
              placeholder="optional"
            />
          </>
        )}
      </div>
      <div className="embed-container">
        {view === 'document-list' && (
          <HulyDocumentList
            externalUser={externalUser}
            onReady={() => onEvent('document-list: ready')}
            onDocumentSelected={(e) => onEvent(`document-selected: ${e.documentId}`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading document list...</div>}
            errorContent={<div className="error-text">Failed to load.</div>}
          />
        )}
        {view === 'create-document' && (
          <HulyCreateDocument
            space={space || undefined}
            externalUser={externalUser}
            onReady={() => onEvent('create-document: ready')}
            onDocumentCreated={(e) => onEvent(`document-created: ${e.documentId}`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading create document...</div>}
            errorContent={<div className="error-text">Failed to load.</div>}
          />
        )}
        {view === 'document' && (
          documentId ? (
            <HulyDocument
              documentId={documentId}
              externalUser={externalUser}
              onReady={() => onEvent(`document: ready (${documentId})`)}
              onError={(e) => onEvent(`error: ${e.reason}`)}
              loadingContent={<div className="loading-text">Loading document...</div>}
              errorContent={<div className="error-text">Failed to load.</div>}
            />
          ) : (
            <div className="empty-state">Enter a document ID above.</div>
          )
        )}
      </div>
    </div>
  );
}
