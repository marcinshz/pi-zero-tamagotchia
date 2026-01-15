import {db} from "../../db.ts";
import {eventStore} from "../../states/EventsState.ts";

export async function importCalendarEvents(){
    if (db) {
        const calendarEvents = await db.from('calendarEvent').select().order('date', {ascending: true}).then(res => res.data);
        if (calendarEvents) eventStore.getState().setEvents(calendarEvents);
    }
}