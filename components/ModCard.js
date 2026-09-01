import Link from 'next/link';

export default function ModCard({ mod }) {
  return (
    <Link href={`/mod/${mod.id}`}>
      <div className="card">
        <div className="card-cover">
          {mod.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mod.cover_url}
              alt={mod.mod_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span>{mod.game_name}</span>
          )}
        </div>

        <div className="card-body">
          <span className="tag">{mod.game_name}</span>
          <h3>{mod.mod_name}</h3>

          <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            {mod.description?.slice(0, 120) || 'No description'}
            {mod.description?.length > 120 ? '...' : ''}
          </p>

          <div className="meta">⬇ {mod.download_count || 0} downloads</div>
        </div>
      </div>
    </Link>
  );
}
