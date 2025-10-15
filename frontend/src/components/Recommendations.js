import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchRecommendations } from '../services/api';

export default function Recommendations(){
  const { token } = useContext(AuthContext);
  const [topics, setTopics] = useState('machine learning');
  const [skill, setSkill] = useState('beginner');
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function getRecs(e){
    e?.preventDefault();
    setLoading(true); setErr(null);
    try{
      const data = await fetchRecommendations(token, topics.split(',').map(s=>s.trim()), skill);
      setRecs(data.recommendations || []);
    }catch(e){
      setErr(e.message || 'failed');
    }finally{ setLoading(false); }
  }

  return (
    <div className='panel'>
      <h3>Recommendations</h3>
      <form onSubmit={getRecs} style={{display:'flex',flexDirection:'column',gap:8}}>
        <label className='small'>Topics (comma separated)</label>
        <input value={topics} onChange={e=>setTopics(e.target.value)} />
        <label className='small'>Skill level</label>
        <input value={skill} onChange={e=>setSkill(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button type='submit'>{loading ? 'Loading...' : 'Get'}</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        {err && <div className='small' style={{color:'#ff9b9b'}}>{err}</div>}
        {recs.length === 0 && <div className='small'>No recommendations yet.</div>}
        {recs.map((r, i)=> (
          <div key={i} className='recommendation'>
            <strong>{r.title}</strong>
            <div className='small'>{r.description}</div>
            <div className='small'>{r.duration} {r.url && <a href={r.url} target='_blank' rel='noreferrer'>↗</a>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
