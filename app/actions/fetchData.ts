import axios from "axios";

async function fetchLaboratoriesData(): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/laboratories`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const apiData = response.data; // Datos de la API sin mapear
    return apiData;
  } catch (error) {
    console.error("Error fetching laboratories data:", error);
    throw error;
  }
}

async function fetchPcsData(): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pcs`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const apiData = response.data; // Datos de la API sin mapear
    return apiData;
  } catch (error) {
    console.error("Error fetching PCs data:", error);
    throw error;
  }
}

export { fetchLaboratoriesData, fetchPcsData };
