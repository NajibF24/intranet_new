import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, Maximize2, Minimize2, Eye, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

var RichTextEditor = lazy(function() { return import('../components/RichTextEditor'); });

const emptyEvent = {
  title: '',
  description: '',
  event_date: format(new Date(), 'yyyy-MM-dd'),
  event_type: 'event',
  location: '',
};

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiService.getEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        event_type: event.event_type,
        location: event.location || '',
      });
    } else {
      setEditingEvent(null);
      setFormData(emptyEvent);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.event_date) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingEvent) {
        await apiService.updateEvent(editingEvent.id, formData);
        toast.success('Event updated successfully');
      } else {
        await apiService.createEvent(formData);
        toast.success('Event created successfully');
      }
      await fetchEvents();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiService.deleteEvent(id);
      toast.success('Event deleted successfully');
      await fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'birthday': return 'bg-pink-100 text-pink-700';
      case 'holiday': return 'bg-amber-100 text-amber-700';
      default: return 'bg-[#0C765B]/10 text-[#0C765B]';
    }
  };

  return (
    <div data-testid="admin-events">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Events Management</h1>
          <p className="text-slate-500 mt-1">Create and manage events, holidays, and birthdays</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-event-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="events-search"
        />
      </div>

      {/* Events List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              data-testid={`event-item-${index}`}
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  {format(parseISO(event.event_date), 'MMM')}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {format(parseISO(event.event_date), 'd')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{event.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{event.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${getEventTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                  {event.location && (
                    <span className="text-xs text-slate-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(event)}
                  data-testid={`edit-event-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  data-testid={`delete-event-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No events found
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className={'fixed inset-0 z-50 flex items-center justify-center ' + (isFullscreen ? '' : 'p-4')}>
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }} />
          <div
            className={'relative bg-white shadow-xl transition-all duration-300 ' +
              (isFullscreen ? 'w-full h-screen' : 'max-w-2xl w-full max-h-[90vh] rounded-xl')}
            data-testid="event-dialog"
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
                <p className="text-sm text-slate-500">Fill in the details for the event</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ' +
                    (showPreview ? 'bg-[#0C765B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                  data-testid="event-preview-toggle"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  data-testid="event-fullscreen-toggle"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="overflow-hidden flex" style={{ height: 'calc(100% - 130px)' }}>
              {/* Editor Panel */}
              <div className={'overflow-y-auto p-6 ' + (showPreview ? 'w-1/2 border-r border-slate-200' : 'w-full')}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Event title"
                      data-testid="event-title-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                    <Suspense fallback={<div className="h-32 bg-slate-100 rounded-lg animate-pulse" />}>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        placeholder="Event description..."
                        dataTestId="event-description-input"
                      />
                    </Suspense>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Date *</label>
                    <Input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      data-testid="event-date-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Type</label>
                    <Select
                      value={formData.event_type}
                      onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                    >
                      <SelectTrigger data-testid="event-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Event location (optional)"
                      data-testid="event-location-input"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Panel */}
              {showPreview && (
                <div className="w-1/2 overflow-y-auto bg-white" data-testid="event-live-preview">
                  <div className="sticky top-0 bg-slate-50 px-4 py-2 border-b border-slate-200 z-10">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Live Preview
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-5 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 bg-[#0C765B]/10 text-[#0C765B] text-xs font-semibold rounded-full capitalize">{formData.event_type}</span>
                          {formData.location && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {formData.location}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          {formData.title || 'Untitled Event'}
                        </h2>
                        {formData.event_date && (
                          <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(parseISO(formData.event_date), 'EEEE, MMMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="p-5">
                        <div
                          className="prose prose-sm prose-slate max-w-none"
                          dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-slate-400">Start writing description to see the preview...</p>' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
              <Button variant="outline" onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0C765B] hover:bg-[#095E49]"
                data-testid="save-event-btn"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
