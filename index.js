//--STATE--
const state = {
  events: [],
  selectedEvent: {},
  rsvps: [],
  guests: [],
};

const getAllEvents = async () => {
  const response = await fetch(
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-FTB-CT-WEB-PT/events"
  );
  const arrayEvents = await response.json();
  state.events = arrayEvents.data;
};

const getAllGuests = async () => {
  const response = await fetch(
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-FTB-CT-WEB-PT/guests"
  );
  const arrayGuests = await response.json();
  console.log(arrayGuests.data);
  state.guests = arrayGuests.data;
  return state.guests;
};

const getAllRSVPs = async () => {
  const response = await fetch(
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-FTB-CT-WEB-PT/rsvps"
  );
  const arrayRSVPs = await response.json();
  console.log(arrayRSVPs.data);
  state.rsvps = arrayRSVPs.data;
  return state.rsvps;
};

getGuestsForSpecificEvent = () => {
  eventId = state.selectedEvent.id;

  //Get all rsvps for selected event id
  const rsvpEventId = state.rsvps.filter((singleItem) => {
    return singleItem.eventId === eventId;
  });

  //Get all guest id for selected event id from rsvps:
  const rsvpGuestsId = rsvpEventId.map((singleGuestId) => {
    return singleGuestId.guestId;
  });

  //Get all guest names based on ther id
  let names = [];
  for (let i = 0; i < state.guests.length; i++) {
    for (let j = 0; j < rsvpGuestsId.length; j++) {
      if (state.guests[i].id === rsvpGuestsId[j]) {
        names.push(state.guests[i].name);
      }
    }
  }
  console.log(names);
  return names;
};

const getEventItem = async (id) => {
  const response = await fetch(
    `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-FTB-CT-WEB-PT/events/${id}`
  );
  const eventJson = await response.json();
  state.selectedEvent = eventJson.data;
  render();
  return state.selectedEvent;
};

const UpcomingPartiesNames = (singleEvent) => {
  const li = document.createElement(`li`);
  const eventLink = document.createElement(`a`);
  eventLink.href = "#party-details";
  eventLink.innerText = singleEvent.name;
  li.append(eventLink);

  if (singleEvent.id === state.selectedEvent.id) {
    eventLink.style.fontWeight = "bold";
    eventLink.style.fontSize = 18 + "px";
  }

  eventLink.addEventListener(`click`, (event) => {
    event.preventDefault();
    eventLink.style.fontWeight = "bold";
    getEventItem(singleEvent.id);
  });

  return li;
};

const UpcomingPartiesList = () => {
  const ul = document.createElement(`ul`);
  ul.classList.add("parties-list");
  state.events.forEach((eachEvent) => {
    ul.append(UpcomingPartiesNames(eachEvent));
  });
  return ul;
};

const UpcomingPartyDetails = () => {
  if (Object.keys(state.selectedEvent).length === 0) {
    const p = document.createElement("p");
    p.innerText = "Please select party to learn more.";
    return p;
  } else {
    //Event name and id
    const h3 = document.createElement(`h3`);
    h3.innerText = `${state.selectedEvent.name} #${state.selectedEvent.id}`;

    //Event date
    const date = document.createElement(`p`);
    const fullDate = state.selectedEvent?.date;
    if (fullDate) {
      const trimmedDate = fullDate.slice(0, 10);
      date.innerText = trimmedDate;
      console.log(trimmedDate);
    } else {
      date.innerText = "No date available";
    }

    //Event address
    const address = document.createElement(`p`);
    address.innerText = state.selectedEvent.location;

    //Event description
    const description = document.createElement(`p`);
    description.innerText = state.selectedEvent.description;

    //Event container
    const detailsContainer = document.createElement(`div`);

    //Guest names
    const allGuestNames = getGuestsForSpecificEvent();
    if (!allGuestNames.length) {
      const p = document.createElement("p");
      p.innerText = "There is no guests for given event.";
      return p;
    } else {
      const ul = document.createElement(`ul`);
      ul.classList.add("guest-names");

      allGuestNames.forEach((singleName) => {
        const name = document.createElement(`li`);
        name.innerText = singleName;
        ul.append(name);
      });

      detailsContainer.classList.add("party-detail");
      detailsContainer.append(h3);
      detailsContainer.append(date);
      detailsContainer.append(address);
      detailsContainer.append(description);
      detailsContainer.append(ul);

      return detailsContainer;
    }
  }
};

//=== Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section id="upcoming-parties">
        <h2>Upcoming Parties</h2>
        <UpcomingParties></UpcomingParties>
      </section>
      <section id="party-details">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;
  $app.querySelector("UpcomingParties").replaceWith(UpcomingPartiesList());
  $app.querySelector("PartyDetails").replaceWith(UpcomingPartyDetails());
}

render();

const init = async () => {
  await getAllEvents();
  await getAllGuests();
  await getAllRSVPs();
  render();
};

init();
