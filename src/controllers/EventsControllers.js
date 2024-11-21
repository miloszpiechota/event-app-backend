import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { EventsModels } from "../models/Models";
env.config();

const salt = bcryptjs.genSaltSync(10);

// Create Event
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
      status,
    } = await req.body;

    const createEvents = await EventModels.create({
      data: {
        name,
        start_date,
        end_date,
        description,
        number_of_ticket,
        photo,
        contact_info,
        idevent_category,
        idevent_location,
        status,
      },
    });

    res.status(201).json({
      success: true,
      msg: "Successfully added event!",
      event: createEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
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
    console.log("error while sending events");
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
      status,
    } = await req.body;

    const checkId = await EventModels.findUnique({
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

    const result = await EventModels.update({
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
        status: status || checkId.status,
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

    const checkId = await EventModels.findUnique({
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

    const result = await EventModels.delete({
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
