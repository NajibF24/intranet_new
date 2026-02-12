import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Save, Eye, ArrowLeft, Plus, Trash2, GripVertical, 
  Type, Image, Columns, LayoutGrid, List, MessageSquare,
  ChevronDown, ChevronUp, Settings, Upload, Quote, BarChart3,
  Users, ImagePlus, Minus, PlayCircle, Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';

// Block type definitions — expanded set
const BLOCK_TYPES = [
  { id: 'hero_simple', name: 'Hero (Simple)', icon: Type, description: 'Title and subtitle header', category: 'Header' },
  { id: 'hero_banner', name: 'Hero (Image)', icon: Image, description: 'Full-width image hero with overlay text', category: 'Header' },
  { id: 'text', name: 'Text Block', icon: Type, description: 'Heading and paragraph', category: 'Content' },
  { id: 'image', name: 'Image', icon: Image, description: 'Single image with caption', category: 'Media' },
  { id: 'image_gallery', name: 'Image Gallery', icon: ImagePlus, description: 'Grid of multiple images', category: 'Media' },
  { id: 'video', name: 'Video Embed', icon: PlayCircle, description: 'YouTube or video URL', category: 'Media' },
  { id: 'two_column', name: 'Two Columns', icon: Columns, description: 'Side by side text content', category: 'Layout' },
  { id: 'cards', name: 'Card Grid', icon: LayoutGrid, description: 'Grid of info cards', category: 'Content' },
  { id: 'features', name: 'Features List', icon: List, description: 'Feature items with descriptions', category: 'Content' },
  { id: 'stats', name: 'Stats / Counters', icon: BarChart3, description: 'Animated number counters', category: 'Content' },
  { id: 'team_grid', name: 'Team Grid', icon: Users, description: 'Team members with photos', category: 'People' },
  { id: 'quote', name: 'Quote / Blockquote', icon: Quote, description: 'Highlighted quote with author', category: 'Content' },
  { id: 'testimonial', name: 'Testimonial', icon: MessageSquare, description: 'Customer testimonial', category: 'Content' },
  { id: 'timeline', name: 'Timeline', icon: Clock, description: 'Chronological events', category: 'Content' },
  { id: 'cta', name: 'Call to Action', icon: MessageSquare, description: 'CTA with button', category: 'Action' },
  { id: 'accordion', name: 'Accordion / FAQ', icon: ChevronDown, description: 'Expandable Q&A sections', category: 'Content' },
  { id: 'divider', name: 'Divider / Spacer', icon: Minus, description: 'Visual separator', category: 'Layout' },
];

// Block Editor Components
const HeroSimpleEditor = ({ content, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
      <Input
        value={content.title || ''}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        placeholder="Page Title"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Subtitle</label>
      <textarea
        value={content.subtitle || ''}
        onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
        placeholder="Page description..."
        className="w-full h-20 px-3 py-2 border border-slate-200 rounded-md text-sm"
      />
    </div>
  </div>
);

const TextEditor = ({ content, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Heading</label>
      <Input
        value={content.heading || ''}
        onChange={(e) => onChange({ ...content, heading: e.target.value })}
        placeholder="Section Heading"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Body Text</label>
      <textarea
        value={content.body || ''}
        onChange={(e) => onChange({ ...content, body: e.target.value })}
        placeholder="Write your content here..."
        className="w-full h-32 px-3 py-2 border border-slate-200 rounded-md text-sm"
      />
    </div>
  </div>
);

const ImageEditor = ({ content, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiService.uploadPhoto(fd);
      onChange({ ...content, url: res.data.image_url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Image</label>
        <label className="cursor-pointer block">
          <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50">
            <Upload className="w-4 h-4 mr-2 text-slate-400" />
            <span className="text-sm text-slate-500">{uploading ? 'Uploading...' : 'Upload Image'}</span>
          </div>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {content.url && (
          <img src={content.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Caption</label>
        <Input
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Image caption (optional)"
        />
      </div>
    </div>
  );
};

const CardsEditor = ({ content, onChange }) => {
  const items = content.items || [];
  
  const addItem = () => {
    onChange({ ...content, items: [...items, { title: '', description: '' }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...content, items: newItems });
  };

  const removeItem = (index) => {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Cards Section Title"
        />
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Card {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Input
              value={item.title || ''}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Card title"
              className="text-sm"
            />
            <textarea
              value={item.description || ''}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Card description"
              className="w-full h-16 px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-1" /> Add Card
        </Button>
      </div>
    </div>
  );
};

const FeaturesEditor = ({ content, onChange }) => {
  const items = content.items || [];
  
  const addItem = () => {
    onChange({ ...content, items: [...items, { title: '', description: '', icon: 'star' }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...content, items: newItems });
  };

  const removeItem = (index) => {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Features Section Title"
        />
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Feature {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Input
              value={item.title || ''}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Feature title"
              className="text-sm"
            />
            <textarea
              value={item.description || ''}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Feature description"
              className="w-full h-16 px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-1" /> Add Feature
        </Button>
      </div>
    </div>
  );
};

const CTAEditor = ({ content, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
      <Input
        value={content.title || ''}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        placeholder="CTA Title"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
      <textarea
        value={content.description || ''}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
        placeholder="CTA description..."
        className="w-full h-20 px-3 py-2 border border-slate-200 rounded-md text-sm"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Button Text</label>
        <Input
          value={content.button_text || ''}
          onChange={(e) => onChange({ ...content, button_text: e.target.value })}
          placeholder="Get Started"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Button Link</label>
        <Input
          value={content.button_link || ''}
          onChange={(e) => onChange({ ...content, button_link: e.target.value })}
          placeholder="/contact"
        />
      </div>
    </div>
  </div>
);

const AccordionEditor = ({ content, onChange }) => {
  const items = content.items || [];
  
  const addItem = () => {
    onChange({ ...content, items: [...items, { title: '', body: '' }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...content, items: newItems });
  };

  const removeItem = (index) => {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="FAQ Section Title"
        />
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Item {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Input
              value={item.title || ''}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Question / Title"
              className="text-sm"
            />
            <textarea
              value={item.body || ''}
              onChange={(e) => updateItem(index, 'body', e.target.value)}
              placeholder="Answer / Content"
              className="w-full h-20 px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>
    </div>
  );
};

const TwoColumnEditor = ({ content, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Left Column</label>
        <textarea
          value={content.left_content || ''}
          onChange={(e) => onChange({ ...content, left_content: e.target.value })}
          placeholder="Left column content..."
          className="w-full h-32 px-3 py-2 border border-slate-200 rounded-md text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Right Column</label>
        <textarea
          value={content.right_content || ''}
          onChange={(e) => onChange({ ...content, right_content: e.target.value })}
          placeholder="Right column content..."
          className="w-full h-32 px-3 py-2 border border-slate-200 rounded-md text-sm"
        />
      </div>
    </div>
  </div>
);

// Block Editor Component Mapping
const getBlockEditor = (type) => {
  switch (type) {
    case 'hero_simple': return HeroSimpleEditor;
    case 'text': return TextEditor;
    case 'image': return ImageEditor;
    case 'cards': return CardsEditor;
    case 'features': return FeaturesEditor;
    case 'cta': return CTAEditor;
    case 'accordion': return AccordionEditor;
    case 'two_column': return TwoColumnEditor;
    default: return TextEditor;
  }
};

// Main Page Editor Component
export function AdminPageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState({});

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const res = await apiService.getPage(pageId);
      setPage(res.data);
      setBlocks(res.data.blocks || []);
      // Expand all blocks by default
      const expanded = {};
      res.data.blocks?.forEach((b, i) => { expanded[i] = true; });
      setExpandedBlocks(expanded);
    } catch (error) {
      toast.error('Failed to load page');
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updatePage(pageId, {
        title: page.title,
        slug: page.slug,
        blocks: blocks,
        is_published: page.is_published
      });
      toast.success('Page saved successfully');
    } catch (error) {
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: {},
      order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
    setExpandedBlocks({ ...expandedBlocks, [blocks.length]: true });
    setShowAddBlock(false);
  };

  const updateBlock = (index, content) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content };
    setBlocks(newBlocks);
  };

  const deleteBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const toggleExpand = (index) => {
    setExpandedBlocks({ ...expandedBlocks, [index]: !expandedBlocks[index] });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 w-1/3 rounded" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div data-testid="admin-page-editor">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/pages')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <Input
              value={page?.title || ''}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Page Title"
            />
            <p className="text-sm text-slate-500">/{page?.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
            <span className="text-sm text-slate-600">Published</span>
            <Switch
              checked={page?.is_published}
              onCheckedChange={(checked) => setPage({ ...page, is_published: checked })}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => window.open(`/page/${page?.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0C765B] hover:bg-[#095E49]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Blocks Editor */}
        <div className="lg:col-span-2 space-y-4">
          {blocks.map((block, index) => {
            const blockType = BLOCK_TYPES.find(b => b.id === block.type);
            const BlockEditor = getBlockEditor(block.type);
            
            return (
              <motion.div
                key={block.id || index}
                layout
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Block Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    {blockType && <blockType.icon className="w-4 h-4 text-[#0C765B]" />}
                    <span className="font-medium text-slate-900">{blockType?.name || block.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                      disabled={index === blocks.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); deleteBlock(index); }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Block Content */}
                {expandedBlocks[index] && (
                  <div className="p-4">
                    <BlockEditor
                      content={block.content}
                      onChange={(content) => updateBlock(index, content)}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Add Block Button */}
          <Button
            variant="outline"
            onClick={() => setShowAddBlock(!showAddBlock)}
            className="w-full py-6 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>

          {/* Block Type Selector */}
          {showAddBlock && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <h4 className="font-medium text-slate-900 mb-4">Choose Block Type</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addBlock(type.id)}
                    className="flex flex-col items-center p-4 border border-slate-200 rounded-lg hover:border-[#0C765B] hover:bg-[#0C765B]/5 transition-all"
                  >
                    <type.icon className="w-6 h-6 text-[#0C765B] mb-2" />
                    <span className="text-sm font-medium text-slate-900">{type.name}</span>
                    <span className="text-xs text-slate-500 mt-1 text-center">{type.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Page Settings Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="font-medium text-slate-900 mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Page Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">URL Slug</label>
                <Input
                  value={page?.slug || ''}
                  onChange={(e) => setPage({ ...page, slug: e.target.value })}
                  placeholder="page-slug"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Meta Title (SEO)</label>
                <Input
                  value={page?.meta_title || ''}
                  onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                  placeholder="SEO Title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Meta Description (SEO)</label>
                <textarea
                  value={page?.meta_description || ''}
                  onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                  placeholder="SEO Description"
                  className="w-full h-20 px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-900 mb-2">Block Count</h4>
            <p className="text-2xl font-bold text-[#0C765B]">{blocks.length}</p>
            <p className="text-sm text-slate-500">blocks on this page</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPageEditor;
