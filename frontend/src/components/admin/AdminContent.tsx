import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  FileText,
  Newspaper,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  type: 'news' | 'blog';
  author: string;
  publishedDate: string;
  status: 'published' | 'draft';
  views: number;
}

export function AdminContent() {
  const [content] = useState<ContentItem[]>([
    {
      id: 1,
      title: 'New Scholarship Opportunities for 2026',
      type: 'news',
      author: 'Admin User',
      publishedDate: '2026-01-15',
      status: 'published',
      views: 1245,
    },
    {
      id: 2,
      title: 'How to Write a Winning Scholarship Application',
      type: 'blog',
      author: 'Admin User',
      publishedDate: '2026-01-12',
      status: 'published',
      views: 987,
    },
    {
      id: 3,
      title: 'Tips for A/L Students Seeking Higher Education',
      type: 'blog',
      author: 'Admin User',
      publishedDate: '2026-01-10',
      status: 'published',
      views: 1532,
    },
    {
      id: 4,
      title: 'Upcoming Scholarship Deadlines',
      type: 'news',
      author: 'Admin User',
      publishedDate: '2026-01-08',
      status: 'draft',
      views: 0,
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'news' | 'blog'>('all');

  const filteredContent = content.filter(
    (item) => filterType === 'all' || item.type === filterType
  );

  const typeCounts = {
    all: content.length,
    news: content.filter((c) => c.type === 'news').length,
    blog: content.filter((c) => c.type === 'blog').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Content Management</h2>
          <p className="text-slate-600">Manage news articles and blog posts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex gap-3">
        {(['all', 'news', 'blog'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <span className="ml-2 font-semibold">({typeCounts[type]})</span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`p-3 rounded-lg ${
                    item.type === 'news' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}
                >
                  {item.type === 'news' ? (
                    <Newspaper className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <Badge
                      className={
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>By {item.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                    </div>
                    {item.status === 'published' && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Content Found</h3>
          <p className="text-slate-600">Create your first article or blog post</p>
        </Card>
      )}
    </div>
  );
}
