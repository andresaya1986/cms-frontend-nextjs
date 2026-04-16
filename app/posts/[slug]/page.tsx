import PostDetailClient from './post-detail-client';

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Sin output: export, no necesitamos generateStaticParams
// La página se renderiza dinámicamente en el servidor

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  return <PostDetailClient slug={slug} />;
}
