'use client';

import { useEffect, useState } from 'react';

interface PostDetailTestProps {
  slug: string;
}

export default function PostDetailTest({ slug }: PostDetailTestProps) {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    console.log('✅ PostDetailTest useEffect executed for slug:', slug);
    setLoaded(true);
    setResult(`Page loaded successfully for slug: ${slug}`);
  }, [slug]);

  return (
    <div style={{ padding: '40px', fontSize: '18px' }}>
      <h1>Test Component</h1>
      <p>Slug: {slug}</p>
      <p>Loaded: {loaded ? '✅ YES' : '❌ NO'}</p>
      <p style={{ marginTop: '20px', color: loaded ? 'green' : 'red' }}>{result || 'Loading...'}</p>
    </div>
  );
}
