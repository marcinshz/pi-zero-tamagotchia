import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";
import eventsData from "../eventsData.json";

export type CalendarEvent = {
    name: string;
    iconPath: string;
    date: string;
}

export interface EventState {
    events: CalendarEvent[];
}

type EventStore = EventState & {
    importEvents: () => void;
};

export const eventStore = createStore<EventStore>()(
    persist(
        (set) => ({
            events: [],
            importEvents: () => set(() => ({events: eventsData}))
        }),
        {name: "eventState"}
    )
);

export function getUpcomingEvents(){
    const now = new Date();
    const events = eventStore.getState().events;
    console.log(new Date(events[0].date))
    console.log(now)
    const upcomingEvents = events.filter(event => new Date(event.date) > now);
    return upcomingEvents.slice(0,2);
}