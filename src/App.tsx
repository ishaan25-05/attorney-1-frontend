import React, { useState, useEffect } from 'react';
import { Filter, Search, Bookmark, Share2, Bell } from 'lucide-react';

interface Source {
  name: string;
  url: string;
}

interface Article {
  articleId: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  source: Source;
}

interface NewsResponse {
  status: string;
  data: {
    articles: Article[];
    count: number;
  };
}

const NewsCard: React.FC<{ article: Article }> = ({ article }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    // Simple share functionality
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.source.url,
      });
    }
  };

  return (
    <div className="bg-legal-dark rounded-xl p-6 border border-legal-brown hover:border-legal-medium transition-all duration-300 hover:bg-legal-dark/90 group">
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-legal-medium/30 text-legal-tan text-xs font-medium rounded-full border border-legal-medium/40"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <h3 className="text-xl font-bold text-legal-tan mb-3 line-clamp-2 group-hover:text-white transition-colors duration-200">
        {article.title}
      </h3>
      
      <p className="text-legal-light mb-4 line-clamp-3 leading-relaxed">
        {article.description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-legal-brown">
        <div className="flex items-center space-x-4">
          <span className="text-legal-light/70 text-sm">
            {formatTimeAgo(article.publishedAt)}
          </span>
          <span className="text-legal-light/50 text-sm">
            {article.source.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isBookmarked 
                ? 'bg-legal-medium/30 text-legal-tan' 
                : 'hover:bg-legal-brown/60 text-legal-light/70 hover:text-legal-tan'
            }`}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-legal-brown/60 text-legal-light/70 hover:text-legal-tan transition-all duration-200"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryFilter: React.FC<{
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
          activeCategory === 'all'
            ? 'bg-legal-medium text-white shadow-lg shadow-legal-medium/30'
            : 'bg-legal-brown/60 text-legal-light hover:bg-legal-brown hover:text-white border border-legal-brown'
        }`}
      >
        All News
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-legal-medium text-white shadow-lg shadow-legal-medium/30'
              : 'bg-legal-brown/60 text-legal-light hover:bg-legal-brown hover:text-white border border-legal-brown'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories from articles
  const categories = Array.from(new Set(articles.flatMap(article => article.tags)));

  const fetchNews = async (tag?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = tag ? `https://attorney-i.onrender.com/api/news?tag=${tag}` : 'https://attorney-i.onrender.com/api/news';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.status === 'success') {
        setArticles(data.data.articles);
      } else {
        throw new Error('API returned error status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback with sample data for demonstration
      setArticles([
        {
          articleId: "1",
          title: "Supreme Court Rules on Corporate Liability in Environmental Cases",
          description: "The Supreme Court's landmark decision establishes new precedent for corporate environmental responsibility, potentially affecting thousands of pending cases nationwide.",
          tags: ["Corporate", "Environmental"],
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: { name: "Legal Tribune", url: "https://legaltribune.com" }
        },
        {
          articleId: "2",
          title: "New Federal Tax Regulations Impact Business Deductions",
          description: "Recent IRS guidelines introduce significant changes to business expense deductions, requiring immediate attention from corporate tax attorneys.",
          tags: ["Corporate", "Tax Law"],
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: { name: "Tax Law Review", url: "https://taxlawreview.com" }
        },
        {
          articleId: "3",
          title: "International Trade Law Updates Affect Cross-Border Transactions",
          description: "New bilateral trade agreements introduce complex regulatory frameworks that require careful legal analysis for multinational corporations.",
          tags: ["International", "Trade"],
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: { name: "International Law Journal", url: "https://intlawjournal.com" }
        },
        {
          articleId: "4",
          title: "Criminal Justice Reform Bill Passes Senate Committee",
          description: "Proposed legislation introduces significant changes to sentencing guidelines and plea bargaining procedures in federal criminal cases.",
          tags: ["Criminal", "Legislation"],
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: { name: "Criminal Law Reporter", url: "https://crimlawreporter.com" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCategory === 'all') {
      fetchNews();
    } else {
      fetchNews(activeCategory);
    }
  }, [activeCategory]);

  const filteredArticles = articles.filter(article =>
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-legal-charcoal">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-legal-medium to-legal-light rounded-lg">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <h1 className="text-3xl font-bold text-legal-tan">Legal Updates</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-legal-light/70" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-legal-dark border border-legal-brown rounded-lg text-legal-tan placeholder-legal-light/50 focus:outline-none focus:border-legal-medium focus:bg-legal-dark/80 transition-all duration-200 w-64"
              />
            </div>
            <button className="p-2 bg-legal-dark border border-legal-brown rounded-lg text-legal-light/70 hover:text-legal-tan hover:border-legal-medium transition-all duration-200">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Breaking News Toggle */}
        <div className="flex items-center justify-between mb-8 p-4 bg-legal-dark/60 rounded-lg border border-legal-brown">
          <div className="flex items-center space-x-3">
            <Bell size={20} className="text-legal-tan" />
            <span className="text-legal-tan font-medium">Enable Breaking News Alerts</span>
          </div>
          <button
            onClick={() => setBreakingNewsEnabled(!breakingNewsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
              breakingNewsEnabled ? 'bg-legal-medium' : 'bg-legal-brown'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                breakingNewsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-legal-medium/20 border border-legal-medium/50 rounded-lg">
            <p className="text-legal-tan">
              {error} - Showing sample data for demonstration
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-legal-dark rounded-xl p-6 border border-legal-brown animate-pulse">
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-legal-brown rounded-full w-20"></div>
                  <div className="h-6 bg-legal-brown rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-legal-brown rounded mb-3"></div>
                <div className="h-4 bg-legal-brown rounded mb-2"></div>
                <div className="h-4 bg-legal-brown rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-legal-brown rounded w-24"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-legal-brown rounded"></div>
                    <div className="w-8 h-8 bg-legal-brown rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-legal-light/70">
                Showing {filteredArticles.length} of {articles.length} articles
                {activeCategory !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-legal-medium/30 text-legal-tan text-xs rounded">
                    {activeCategory}
                  </span>
                )}
              </p>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard key={article.articleId} article={article} />
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search size={48} className="text-legal-light/50 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-legal-tan mb-2">No articles found</h3>
                <p className="text-legal-light/70">
                  {searchQuery 
                    ? `No articles match "${searchQuery}"`
                    : `No articles available for ${activeCategory}`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;