import { notFound } from 'next/navigation';
import { EditPostClient } from './edit-post-wrapper';

// Fetch post data on the server
async function getPost(slug: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/posts/${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch post:', err);
    return null;
  }
}

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  return <EditPostClient post={post} />;
}
