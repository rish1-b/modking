import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Upload() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [modName, setModName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose a mod file to upload.');
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Please log in first to upload a mod.');
      setSubmitting(false);
      return;
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('mod-files')
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setSubmitting(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('mod-files')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('mods').insert({
      creator_id: user.id,
      game_name: gameName,
      mod_name: modName,
      description,
      file_url: publicUrlData.publicUrl,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      router.push('/');
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Upload a Mod</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Game name (e.g. Minecraft)"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Mod name"
          value={modName}
          onChange={(e) => setModName(e.target.value)}
          required
        />
        <textarea
          className="textarea"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        {error && <p style={{ color: '#ff6b6b', marginBottom: 12 }}>{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Uploading...' : 'Upload Mod'}
        </button>
      </form>
    </div>
  );
  }
