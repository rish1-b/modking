import Link from 'next/link';

export default function ModCard({ mod }) {
  return (
    <Link href={`/mod/${mod.id}`}>
      <div className="card">
        <span className="tag">{mod.game_name}</span>
        <h3>{mod.mod_name}</h3>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          {mod.description?.slice(0, 80) || 'No description'}
          {mod.description?.length > 80 ? '...' : ''}
        </p>
        <div className="meta">⬇ {mod.download_count || 0} downloads</div>
      </div>
    </Link>
  );
}
