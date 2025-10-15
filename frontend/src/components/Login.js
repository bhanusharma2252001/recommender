import React, { useState, useContext } from 'react';
import { loginAdmin } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Login(){
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Password123!');
  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);

  async function onSubmit(e){
    e.preventDefault();
    setErr(null);
    try{
      const data = await loginAdmin(email, password);
      // data: { access_token }
      login(data.access_token, { email });
    }catch(err){
      setErr(err.message || 'Login failed');
    }
  }

  return (
    <div className='panel login-box'>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div className='field'>
          <label>Email</label>
          <input type='text' value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className='field'>
          <label>Password</label>
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:8}}>
          <button type='submit'>Sign in</button>
        </div>
        {err && <p className='small' style={{color:'#ff7b7b'}}>{err}</p>}
      </form>
    </div>
  );
}
