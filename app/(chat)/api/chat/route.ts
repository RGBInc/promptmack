import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";
import axios from "axios";

import { geminiProModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        - you help users book flights and find news!
        - don't rush things perhaps you may help people find clarity
        - don't be a bitch
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, DON'T pretend you're showing the result to the user and keep your response limited to a phrase.
        - today's date is ${new Date().toLocaleDateString()}.
        - go with the flow
        - ask for any details you don't know, like name of passenger, etc.'
        - C and D are aisle seats, A and F are window seats, B and E are middle seats
        - assume the most popular airports for the origin and destination
        - here's the optimal flow
          - search for flights
          - choose flight
          - select seats
          - create reservation (ask user whether to proceed with payment or change reservation)
          - authorize payment (requires user consent, wait for user to finish payment and let you know when done)
          - display boarding pass (DO NOT display boarding pass without verifying payment)
        '
      `,
    messages: coreMessages,
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      displayFlightStatus: {
        description: "Display the status of a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
          date: z.string().describe("Date of the flight"),
        }),
        execute: async ({ flightNumber, date }) => {
          const flightStatus = await generateSampleFlightStatus({
            flightNumber,
            date,
          });

          return flightStatus;
        },
      },
      searchFlights: {
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport or city"),
          destination: z.string().describe("Destination airport or city"),
        }),
        execute: async ({ origin, destination }) => {
          const results = await generateSampleFlightSearchResults({
            origin,
            destination,
          });

          return results;
        },
      },
      selectSeats: {
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
        }),
        execute: async (props) => {
          const { totalPriceInUSD } = await generateReservationPrice(props);
          const session = await auth();

          const id = generateUUID();

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
              details: { ...props, totalPriceInUSD },
            });

            return { id, ...props, totalPriceInUSD };
          } else {
            return {
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to repond when they are done",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          const reservation = await getReservationById({ id: reservationId });

          if (reservation.hasCompletedPayment) {
            return { hasCompletedPayment: true };
          } else {
            return { hasCompletedPayment: false };
          }
        },
      },
      displayBoardingPass: {
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
      getNews: {
        description: "Get news articles based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for news"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/news`,
              {
                params: {
                  q: query,
                  location: "United States",
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("News API error:", error);
            throw error;
          }
        },
      },
      getVideos: {
        description: "Get videos based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for videos"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/videos`,
              {
                params: {
                  q: query,
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("Videos API error:", error);
            throw error;
          }
        },
      },
      getShopping: {
        description: "Get shopping products based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for shopping products"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/shopping`,
              {
                params: {
                  q: query,
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("Shopping API error:", error);
            throw error;
          }
        },
      },
      getScholar: {
        description: "Get scholarly articles based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for scholarly articles"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/scholar`,
              {
                params: {
                  q: query,
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("Scholar API error:", error);
            throw error;
          }
        },
      },
      findSimilar: {
        description: "Find similar websites based on a URL",
        parameters: z.object({
          url: z.string().describe("URL to find similar websites for"),
        }),
        execute: async ({ url }) => {
          try {
            // Extract base domain and company name
            const baseDomain = url.replace(/^https?:\/\//, '')  // Remove protocol
                                .replace(/^www\./, '')          // Remove www
                                .split('/')[0];                 // Remove path
            
            // Get company name (e.g., "lemlist" from "lemlist.com")
            const companyName = baseDomain.split('.')[0];

            const response = await axios.post(
              'https://api.exa.ai/findSimilar',
              {
                query: url,
                url: url,
                numResults: 10,
                excludeDomains: [baseDomain],
                excludeText: [companyName],
                contents: {
                  highlights: true,
                  summary: true
                }
              },
              {
                headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'x-api-key': process.env.EXA_API_KEY
                }
              }
            );
            return response.data;
          } catch (error) {
            console.error("Exa API error:", error);
            throw error;
          }
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
