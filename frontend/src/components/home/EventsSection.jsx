import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Cake, PartyPopper, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Calendar } from '../../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { apiService } from '../../lib/api';
import { format, parseISO, isSameDay } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: format(new Date(), 'yyyy-MM-dd'),
    event_type: 'event',
    location: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiService.getEvents({ limit: 50 });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      await apiService.createEvent(newEvent);
      await fetchEvents();
      setIsDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        event_date: format(new Date(), 'yyyy-MM-dd'),
        event_type: 'event',
        location: '',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const holidays = events.filter(e => e.event_type === 'holiday');
  const birthdays = events.filter(e => e.event_type === 'birthday');
  const upcomingEvents = events
    .filter(e => e.event_type === 'event' && new Date(e.event_date) >= new Date())
    .slice(0, 4);

  const eventDates = events.map(e => parseISO(e.event_date));

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'birthday': return Cake;
      case 'holiday': return PartyPopper;
      default: return CalendarDays;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'birthday': return 'bg-pink-100 text-pink-600';
      case 'holiday': return 'bg-amber-100 text-amber-600';
      default: return 'bg-[#0C765B]/10 text-[#0C765B]';
    }
  };

  const selectedDateEvents = events.filter(e => 
    isSameDay(parseISO(e.event_date), selectedDate)
  );

  if (loading) {
    return (
      <section className="py-24 bg-white" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid lg:grid-cols-2 gap-12">
            <div className="h-96 bg-slate-100 rounded-2xl" />
            <div className="h-96 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white" id="events" data-testid="events-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-[#0C765B] font-semibold text-sm uppercase tracking-wider mb-2 block">
              Mark Your Calendar
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Events & Calendar
            </h2>
          </div>
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#0C765B] hover:bg-[#095E49] text-white"
                  data-testid="add-event-btn"
                >
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
                      data-testid="event-title-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
                    <Input
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event description"
                      data-testid="event-description-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      data-testid="event-date-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Type</label>
                    <Select
                      value={newEvent.event_type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
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
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Event location (optional)"
                      data-testid="event-location-input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddEvent}
                    className="bg-[#0C765B] hover:bg-[#095E49]"
                    data-testid="submit-event-btn"
                  >
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Holidays & Birthdays */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Holidays */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <PartyPopper className="w-5 h-5 mr-2 text-amber-500" />
                Upcoming Holidays
              </h3>
              <div className="space-y-3">
                {holidays.slice(0, 4).map((holiday, index) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
                    data-testid={`holiday-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-amber-600 font-semibold">
                          {format(parseISO(holiday.event_date), 'MMM')}
                        </span>
                        <span className="text-lg font-bold text-amber-700">
                          {format(parseISO(holiday.event_date), 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{holiday.title}</p>
                        <p className="text-sm text-slate-500">{holiday.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {holidays.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No upcoming holidays</p>
                )}
              </div>
            </div>

            {/* Birthdays */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Cake className="w-5 h-5 mr-2 text-pink-500" />
                Birthday Celebrations
              </h3>
              <div className="space-y-3">
                {birthdays.slice(0, 4).map((birthday, index) => (
                  <div
                    key={birthday.id}
                    className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
                    data-testid={`birthday-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-pink-600 font-semibold">
                          {format(parseISO(birthday.event_date), 'MMM')}
                        </span>
                        <span className="text-lg font-bold text-pink-700">
                          {format(parseISO(birthday.event_date), 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{birthday.title}</p>
                        <p className="text-sm text-slate-500">{birthday.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {birthdays.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No upcoming birthdays</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-lg"
                modifiers={{
                  event: eventDates,
                }}
                modifiersStyles={{
                  event: {
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(12, 118, 91, 0.1)',
                    color: '#0C765B',
                    borderRadius: '50%',
                  },
                }}
                data-testid="event-calendar"
              />

              {/* Selected Date Events */}
              {selectedDateEvents.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Events on {format(selectedDate, 'MMMM d, yyyy')}
                  </h4>
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => {
                      const Icon = getEventTypeIcon(event.event_type);
                      return (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg flex items-center space-x-3 ${getEventTypeColor(event.event_type)}`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <p className="font-medium">{event.title}</p>
                            {event.location && (
                              <p className="text-xs flex items-center mt-1 opacity-80">
                                <MapPin className="w-3 h-3 mr-1" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming Events List */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-3">Upcoming Events</h4>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 text-sm"
                      data-testid={`upcoming-event-${index}`}
                    >
                      <div className="w-10 h-10 bg-[#0C765B]/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-[#0C765B] font-semibold">
                          {format(parseISO(event.event_date), 'MMM')}
                        </span>
                        <span className="text-sm font-bold text-[#0C765B]">
                          {format(parseISO(event.event_date), 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{event.title}</p>
                        {event.location && (
                          <p className="text-slate-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-slate-500 text-center py-2">No upcoming events</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
