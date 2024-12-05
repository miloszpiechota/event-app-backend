import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { EventLocationsModels, EventsModels } from "../models/Models";
env.config();
const URL = 'http://localhost:3000';
const salt = bcryptjs.genSaltSync(10);

// Create Event
// export const EventCreate = async (req = request, res = response) => {
//   try {
//     const {
//       name,
//       start_date,
//       end_date,
//       description,
//       number_of_ticket,
//       photo,
//       contact_info,
//       idevent_category,
//       idevent_location,
//       idstatus_type,
//     } = await req.body;

//     const createEvents = await EventModels.create({
//       data: {
//         name,
//         start_date,
//         end_date,
//         description,
//         number_of_ticket,
//         photo,
//         contact_info,
//         idevent_category,
//         idevent_location,
//         idstatus_type,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       msg: "Successfully added event!",
//       event: createEvents,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };



export const EventCreate = async (req = request, res = response) => {
  try {
    const {
      name,
      start_date,
      end_date,
      description,
      number_of_ticket,
      photo,
      contact_info,
      idevent_category,
      idevent_location,
      idstatus_type,
      custom_location_name,
      city_id,
    } = req.body;
    console.log(req.body);
    let locationId = idevent_location;

    // Dodaj nową lokalizację, jeśli podano `custom_location_name` i `city_id`, ale brak `idevent_location`
    if (custom_location_name && city_id && !idevent_location) {
      try {
        // Dodaj lokalizację
        const locationResponse = await axios.post(`${URL}/api/locations/create`, {
          name: custom_location_name,
          city_id,
        });

        if (locationResponse.data && locationResponse.data.success) {
          // Wyciągnij `idevent_location` nowo dodanej lokalizacji
          const locationIdResponse = await axios.get(
            `${URL}/api/locations/read-by-name`,
            {
              params: {
                name: custom_location_name,
                city_id,
              },
            }
          );

          if (locationIdResponse.data && locationIdResponse.data.success) {
            locationId = locationIdResponse.data.location.idevent_location;
          } else {
            return res.status(400).json({
              success: false,
              error: "Failed to fetch the newly created location ID.",
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            error: "Failed to create a new location.",
          });
        }
      } catch (error) {
        console.error("Error creating location or fetching its ID:", error);
        return res.status(500).json({
          success: false,
          error: "Internal Server Error while creating location or fetching its ID.",
        });
      }
    }

    // Tworzenie wydarzenia w bazie danych
    const newEvent = await EventsModels.create({
      data: {
        name,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        description,
        number_of_ticket: parseInt(number_of_ticket),
        photo,
        contact_info,
        idevent_category: idevent_category ? parseInt(idevent_category) : null,
        idevent_location: locationId,
        idstatus_type: idstatus_type ? parseInt(idstatus_type) : null,
      },
    });

    res.status(201).json({
      success: true,
      msg: "Successfully created event!",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


// Read Events
export const EventRead = async (req = request, res = response) => {
  try {
    const { id } = req.params; // Get the event ID from URL params
    let readEvents;

    if (id) {
      // Fetch a specific event by ID if ID is provided
      readEvents = await EventsModels.findUnique({
        where: { idevent: parseInt(id) }, // Assuming 'idevent' is the field for event ID
        select: {
          idevent: true,
          name: true,
          start_date: true,
          end_date: true,
          description: true,
          number_of_ticket: true,
          photo: true,
          contact_info: true,
          idevent_category: true,
          idevent_location: true,
          idstatus_type: true,
          is_seat_categorized: true,
        },
      });
    } else {
      // Fetch all events if no ID is provided
      readEvents = await EventsModels.findMany({
        select: {
          idevent: true,
          name: true,
          start_date: true,
          end_date: true,
          description: true,
          number_of_ticket: true,
          photo: true,
          contact_info: true,
          idevent_category: true,
          idevent_location: true,
          idstatus_type: true,
          is_seat_categorized: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      msg: "Successfully read event(s)!",
      event: readEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// update Event
export const EventUpdate = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const {
      name,
      start_date,
      end_date,
      description,
      number_of_ticket,
      photo,
      contact_info,
      idevent_category,
      idevent_location,
      idstatus_type,
    } = await req.body;

    const checkId = await EventsModels.findUnique({
      where: {
        idevent: parseInt(id),
      },
    });

    if (!checkId) {
      return res.status(404).json({
        success: false,
        message: "Id not found!",
      });
    }

    const result = await EventsModels.update({
      where: {
        idevent: parseInt(id),
      },
      data: {
        name: name || checkId.name,
        start_date: start_date || checkId.start_date,
        end_date: end_date || checkId.end_date,
        description: description || checkId.description,
        number_of_ticket: number_of_ticket || checkId.number_of_ticket,
        photo: photo || checkId.photo,
        contact_info: contact_info || checkId.contact_info,
        idevent_category: idevent_category || checkId.idevent_category,
        idevent_location: idevent_location || checkId.idevent_location,
        idstatus_type: idstatus_type || checkId.idstatus_type,
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully updated event!",
      event: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete Event
export const EventDelete = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const checkId = await EventsModels.findUnique({
      where: {
        idevent: parseInt(id),
      },
    });

    if (!checkId) {
      return res.status(404).json({
        success: false,
        message: "Id not found!",
      });
    }

    const result = await EventsModels.delete({
      where: {
        idevent: parseInt(id),
      },
    });

    res.status(201).json({
      success: true,
      msg: "Successfully delete event!",
      event: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const EventSearch = async (req = request, res = response) => {
  try {
    const { name } = req.query;

    const searchEvents = await EventsModels.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    res.status(200).json({
      success: true,
      msg: "Successfully search event!",
      event: searchEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const EventReadIdCity = async (req = request, res = response) => {
  try {
    const { idCity } = req.params; // Get the event ID from URL params

    // Fetch all events if no ID is provided
    const readLocations = await EventLocationsModels.findMany({
      where: { idcity: parseInt(idCity) },
      select: {
        idevent_location: true,
        name: true,
        idcity: true,
      },
    });

    const locationIds = readLocations.map(
      (location) => location.idevent_location
    );
    let readEvents = await EventsModels.findMany({
      where: { idevent_location: { in: locationIds } },
      select: {
        idevent: true,
        name: true,
        start_date: true,
        end_date: true,
        description: true,
        number_of_ticket: true,
        photo: true,
        contact_info: true,
        idevent_category: true,
        idevent_location: true,
        idstatus_type: true,
        is_seat_categorized: true,
      },
    });

    res.status(200).json({
      success: true,
      msg: "Successfully read event(s)!",
      event: readEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const GetEventsByDateRange = async (req = request, res = response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        msg: "Missing startDate or endDate in query parameters.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const readEvents = await EventsModels.findMany({
      where: {
        AND: [{ start_date: { gte: start } }, { end_date: { lte: end } }],
      },
    });

    if (!readEvents || readEvents.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No events found in the specified date range.",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Successfully fetched events.",
      events: readEvents,
    });
  } catch (error) {
    console.error("Error fetching events by date range:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
