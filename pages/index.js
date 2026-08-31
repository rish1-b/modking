import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import ModCard from '../components/ModCard';

export default function Home() {
  const [mods, setMods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMods();
  }, []);

  async function fetchMods() {
    setLoading(true);
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setMods(data);
    setLoading(false);
  }

  const filtered = mods.filter(
    (m) =>
      m.mod_name.toLowerCase().includes(search.toLowerCase()) ||
      m.game_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <nav className="navbar">
        <div className="logo">MODKING</div>
        <Link href="/upload">
          <button className="btn">Upload Mod</button>
        </Link>
      </nav>

      <div className="container">
        <input
          className="input"
          placeholder="Search mods or games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading mods...</p>
        ) : filtered.length === 0 ? (
          <p>No mods yet. Be the first to upload one.</p>
        ) : (
          <div className="grid">
            {filtered.map((mod) => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
            }
