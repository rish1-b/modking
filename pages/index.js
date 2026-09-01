import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import ModCard from '../components/ModCard';

export default function Home() {
  const [mods, setMods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMods();
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

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

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/upload">
            <button className="btn">Upload Mod</button>
          </Link>
          {user ? (
            <>
              <span style={{ color: '#c8c8cc', fontSize: '14px' }}>
                {user.email}
              </span>
              <button
                className="btn"
                onClick={handleLogout}
                style={{
                  background: '#ff6b6b',
                  color: '#fff',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="btn">Login</button>
            </Link>
          )}
        </div>
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
