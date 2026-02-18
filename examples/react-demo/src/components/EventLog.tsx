import type { LogEntry } from '../App';

interface EventLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function EventLog({ logs, onClear }: EventLogProps) {
  return (
    <div className="event-log">
      <div className="event-log-header">
        <h3>Event Log</h3>
        <button className="clear-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="log-entries">
        {logs.length === 0 && (
          <div className="log-empty">No events yet</div>
        )}
        {logs.map((entry, i) => (
          <div key={i} className="log-entry">
            <span className="log-time">{entry.time}</span>
            <span className="log-message">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
