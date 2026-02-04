import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <DialogDescription>Fill in the details for the event.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description"
                data-testid="event-description-input"
              />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
