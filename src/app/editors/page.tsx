import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditorsPage() {
  // Editors with their articles
  const editors = [
    {
      id: 'bigdirectorharold',
      name: 'Harold',
      username: 'bigdirectorharold',
      bio: 'The creator of this movie log.',
      articles: [
        {
          id: 'top10-2025',
          title: "Top 10 Movies in Theater 2025",
          href: '/top10'
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white hover:text-neutral-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Editors
          </h1>
          <p className="text-neutral-500 mt-2">Curated movie lists from our editors</p>
        </header>

        {/* Editors */}
        <div className="space-y-8">
          {editors.map(editor => (
            <div key={editor.id} className="border border-neutral-800 rounded-xl overflow-hidden">
              {/* Editor Header */}
              <div className="p-4 bg-neutral-900/50 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{editor.name}</h2>
                    <p className="text-sm text-neutral-500">@{editor.username}</p>
                  </div>
                  <Link 
                    href={`/${editor.username}/log`}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-white hover:border-white transition-all"
                  >
                    View Profile
                  </Link>
                </div>
                {editor.bio && (
                  <p className="text-sm text-neutral-400 mt-2">{editor.bio}</p>
                )}
              </div>
              
              {/* Editor's Articles */}
              <div className="p-4">
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">
                  Articles ({editor.articles.length})
                </p>
                <div className="space-y-2">
                  {editor.articles.map(article => (
                    <Link 
                      key={article.id}
                      href={article.href}
                      className="block p-3 border border-neutral-800 rounded-lg hover:border-white transition-colors"
                    >
                      <p className="text-white font-medium">{article.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
