import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Cake, PartyPopper, CalendarPlus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { apiService } from '../lib/api';
import { format, parseISO, isSameDay, isSameMonth } from 'date-fns';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiService.getEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate ICS file content for Outlook/Calendar
  const generateICSContent = (event) => {
    const eventDate = parseISO(event.event_date);
    const startDate = format(eventDate, "yyyyMMdd");
    const endDate = format(eventDate, "yyyyMMdd");
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PT Garuda Yamato Steel//GYS Intranet//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || 'PT Garuda Yamato Steel'}`,
      `UID:${event.id}@gys-intranet`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  };

  // Download ICS file for adding to Outlook
  const handleAddToOutlook = (event) => {
    const icsContent = generateICSContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter(e => filterType === 'all' || e.event_type === filterType);
  const monthEvents = filteredEvents.filter(e => isSameMonth(parseISO(e.event_date), selectedDate));
  const selectedDateEvents = filteredEvents.filter(e => isSameDay(parseISO(e.event_date), selectedDate));
  const eventDates = events.map(e => parseISO(e.event_date));

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'birthday': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'holiday': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-[#0C765B]/10 text-[#0C765B] border-[#0C765B]/20';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'birthday': return Cake;
      case 'holiday': return PartyPopper;
      default: return CalendarDays;
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="events-page">
      <Header />
      <PageContainer
        title="Events Calendar"
        subtitle="Stay up to date with company events, holidays, and celebrations at PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Communication', path: '/' },
          { label: 'Events Calendar' },
        ]}
        category="events"
      >
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {['all', 'event', 'holiday', 'birthday'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-[#0C765B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>
          {user && user.role === 'admin' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0C765B] hover:bg-[#095E49] text-white" data-testid="add-event-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Create a new event for the calendar.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
                    <Input
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event description"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Type</label>
                    <Select
                      value={newEvent.event_type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                    >
                      <SelectTrigger>
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
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Event location (optional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEvent} className="bg-[#0C765B] hover:bg-[#095E49]">
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-slate-100 rounded-xl" />
            <div className="h-96 bg-slate-100 rounded-xl" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-24">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-lg"
                  modifiers={{ event: eventDates }}
                  modifiersStyles={{
                    event: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(12, 118, 91, 0.15)',
                      color: '#0C765B',
                      borderRadius: '50%',
                    },
                  }}
                />

                {/* Selected Date Events */}
                {selectedDateEvents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h4>
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => {
                        const Icon = getEventTypeIcon(event.event_type);
                        return (
                          <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.event_type)}`}>
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span className="font-medium text-sm">{event.title}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Events in {format(selectedDate, 'MMMM yyyy')}
              </h3>
              {monthEvents.length > 0 ? (
                monthEvents.map((event, index) => {
                  const Icon = getEventTypeIcon(event.event_type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs text-slate-500 font-medium">
                            {format(parseISO(event.event_date), 'MMM')}
                          </span>
                          <span className="text-2xl font-bold text-slate-900">
                            {format(parseISO(event.event_date), 'd')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                              <Icon className="w-3 h-3 inline mr-1" />
                              {event.event_type}
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-1">{event.title}</h4>
                          <p className="text-slate-600 text-sm mb-2">{event.description}</p>
                          {event.location && (
                            <p className="text-slate-500 text-sm flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-slate-500">
                  No events found for this month.
                </div>
              )}
            </div>
          </div>
        )}
      </PageContainer>
      <Footer />
    </div>
  );
};

export default EventsPage;
