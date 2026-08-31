import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function ModDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [mod, setMod] = useState(null);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMod();
      fetchRatings();
    }
  }, [id]);

  async function fetchMod() {
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .eq('id', id)
      .single();
    if (!error) setMod(data);
  }

  async function fetchRatings() {
    const { data, error } = await supabase
      .from('ratings')
      .select('stars')
      .eq('mod_id', id);
    if (!error && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
      setAvgRating(avg.toFixed(1));
    }
  }

  async function handleDownload() {
    if (!mod) return;
    await supabase
      .from('mods')
      .update({ download_count: (mod.download_count || 0) + 1 })
      .eq('id', mod.id);
    window.open(mod.file_url, '_blank');
    fetchMod();
  }

  async function handleRate(stars) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to rate this mod.');
      return;
    }
    await supabase
      .from('ratings')
      .upsert({ mod_id: id, user_id: user.id, stars }, { onConflict: 'mod_id,user_id' });
    fetchRatings();
  }

  if (!mod) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <span className="tag">{mod.game_name}</span>
      <h2>{mod.mod_name}</h2>
      <p style={{ margin: '12px 0', color: '#c8c8cc' }}>{mod.description}</p>
      <p className="meta">
        ⬇ {mod.download_count || 0} downloads
        {avgRating && ` · ⭐ ${avgRating}/5`}
      </p>

      <button className="btn" style={{ marginTop: 16 }} onClick={handleDownload}>
        Download Mod
      </button>

      <div style={{ marginTop: 20 }}>
        <p style={{ marginBottom: 8 }}>Rate this mod:</p>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleRate(n)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: '#6ee7ff',
            }}
          >
            {n <= (avgRating || 0) ? '★' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
}
