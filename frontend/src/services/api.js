const base = 'http://localhost';// through nginx proxy (same origin)

export async function loginAdmin(email, password){
  const res = await fetch(`${base}/auth/login`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchRecommendations(token, topics, skillLevel){
  const res = await fetch(`${base}/api/recommendations`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ topics, skillLevel })
  });
  if (!res.ok) {
    const txt = await res.text(); throw new Error('Reco failed: ' + txt);
  }
  return res.json();
}

export async function searchCourses(token, q, category, instructor, page = 1, size = 10){
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (category) params.append('category', category);
  if (instructor) params.append('instructor', instructor);
  params.append('page', String(page));
  params.append('size', String(size));
  const res = await fetch(`${base}/api/courses/search?${params.toString()}`, {
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    let err = `Search failed: ${res.status}`;
    try {
      const body = await res.json();
      err = body?.error || body?.message || JSON.stringify(body);
    } catch (e) {
      const txt = await res.text();
      if (txt) err = txt;
    }
    throw new Error(err);
  }
  return res.json(); 
}


export async function uploadCoursesCSV(token, file){
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${base}/api/courses/upload`, {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${token}` },
    body: fd
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
