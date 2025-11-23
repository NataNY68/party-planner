//--DOM Element

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
  render();
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

getAllGuests();

const getAllRSVPs = async () => {
  const response = await fetch(
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-FTB-CT-WEB-PT/rsvps"
  );
  const arrayRSVPs = await response.json();
  console.log(arrayRSVPs.data);
  state.rsvps = arrayRSVPs.data;
  return state.rsvps;
  // const allGuest = await getAllGuests();
  // allGuest.filter((guest) => {});
};

getAllRSVPs();

const guestForSelectedEvent = () => {
  const singleEventId = state.selectedEvent.id;
  const eventRsvp = state.rsvps.filter((rsvp) => {
    rsvp.eventId === singleEventId;
  });
  const guestIds = new Set(
    eventRsvp.map((eachRsvp) => {
      eachRsvp.guestId;
    })
  );
  const eventGuests = state.guests.filter((guest) => {
    guestIds.has(guest.id);
  });
  console.log(eventGuests);
  return eventGuests;
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
  state.events.forEach((eachEvent) => {
    ul.append(UpcomingPartiesNames(eachEvent));
  });
  //console.log(ul);
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
    const detailsContainer = document.createElement(`container`);

    //Event address
    const address = document.createElement(`p`);
    address.innerText = state.selectedEvent.location;

    //Event description
    const description = document.createElement(`p`);
    description.innerText = state.selectedEvent.description;

    //Event guests
    const guests = guestForSelectedEvent();
    const guestsElement = document.createElement(`div`);
    // if (!guests.length) {
    //   const noGuests = document.createElement(`p`);
    //   noGuests.innerText = "No RSVPs yet";
    //   guestsElement.append(noGuests);
    // } else {
    const list = document.createElement(`ul`);
    guests.forEach((guest) => {
      const li = document.createElement(`li`);
      li.innerText = guest.name;
      list.append(li);
    });
    detailsContainer.append(list);
    //}

    //Event container

    detailsContainer.classList.add("party-detail");
    detailsContainer.append(h3);
    detailsContainer.append(date);
    detailsContainer.append(address);
    detailsContainer.append(description);
    detailsContainer.append(guestsElement);

    return detailsContainer;
  }
};

UpcomingPartyDetails();

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
