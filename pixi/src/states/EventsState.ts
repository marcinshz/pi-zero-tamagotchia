import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";

export type CalendarEventType = {
    name: string;
    date: string;
}

export interface EventState {
    events: CalendarEventType[];
}

type EventStore = EventState & {
    setEvents:(events:CalendarEventType[]) => void;
};

export const eventStore = createStore<EventStore>()(
    persist(
        (set) => ({
            events: [],
            setEvents:  (events) => set(() => ({events})),
        }),
        {name: "eventState"}
    )
);

export function getUpcomingEvents(){
    const now = new Date();
    const events = eventStore.getState().events;
    const upcomingEvents = events.filter(event => new Date(event.date) > now);
    return upcomingEvents.slice(0,2);
}