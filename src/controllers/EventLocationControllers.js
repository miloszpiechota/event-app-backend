import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { EventLocationsModels } from "../models/Models";
import { connect } from "http2";
// import userTypes from "../config/userTypes";
import { body, validationResult } from "express-validator";

env.config();

const salt = bcryptjs.genSaltSync(10);
export const EventLocationRead = async (req = request, res = response) => {
    try {
        // Pobieramy lokalizacje wraz z miastami i krajami
        const event_locations = await EventLocationsModels.findMany({
            include: {
                city: {
                    include: {
                        country: true // Dołączamy kraj
                    }
                }
            }
        });

        //console.log("event_locations found:", event_locations);
        res.status(200).json(event_locations);
    } catch (error) {
        //console.error("Error fetching event_locations:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const EventLocationReadById = async (req = request, res = response) =>{
    //console.log("Fetching location...");
    const { id } = req.params;

    // Sprawdzenie, czy id jest liczbą
    const locationId = parseInt(id);
    if (isNaN(locationId)) {
        //console.error("Invalid location ID");
        return res.status(400).json({ success: false, error: "Invalid location ID" });
    }

    try {
        const location = await EventLocationsModels.findUnique({
            where: {
                idevent_location: locationId,  // Wyszukuje po `idevent_location`
            },
            include: {
                city: {
                    include: {
                        country: true // Dołączamy kraj
                    }
                }
            }
        });

        if (!location) {
            console.log("Location not found");
            return res.status(404).json({ success: false, error: "Location not found" });
        }

        // Struktura zwracanych danych: lokalizacja -> miasto -> kraj
        res.status(200).json({
            success: true,
            data: {
                location_name: location.name,
                city_name: location.city.city,
                country_name: location.city.country.name_country
            }
        });
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Pobierz ID lokalizacji po nazwie i mieście
export const EventLocationReadByName = async (req = request, res = response) => {
    const { name, city_id } = req.query;

    if (!name || !city_id) {
        return res.status(400).json({ success: false, error: "Name and city_id are required" });
    }

    try {
        const location = await EventLocationsModels.findFirst({
            where: {
                name,
                idcity: parseInt(city_id),
            },
            select: {
                idevent_location: true, // Pobieramy tylko ID lokalizacji
            },
        });

        if (!location) {
            return res.status(404).json({ success: false, error: "Location not found" });
        }

        res.status(200).json({ success: true, location });
    } catch (error) {
        console.error("Error fetching location by name:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

    

export const EventLocationCreate = async (req = request, res = response) =>  {
    const { name, city_id } = req.body;
  
    if (!name || !city_id) {
      return res.status(400).json({ success: false, error: "Name and city_id are required" });
    }
  
    try {
      const newLocation = await EventLocationsModels.create({
        data: {
          name,
          idcity: parseInt(city_id),
        },
      });
  
      res.status(201).json({ success: true, location: newLocation });
    } catch (error) {
      console.error("Error creating new location:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  
