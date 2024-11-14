import { DiaryEntry } from "../types";

const baseUrl = "http://localhost:80/api/diaries";

export const getAllDiaries = async (): Promise<DiaryEntry[]> => {
  try {
    const response = await fetch(`${baseUrl}/`);  
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: DiaryEntry[] = await response.json();
    console.log("Fetched Diaries:", data);
    return data;
  } catch (error) {
    console.error("Error fetching diaries:", error);
    throw error;  
  }
};
export const createDiary = async (newDiary: DiaryEntry): Promise<DiaryEntry> => {
  try {
    const response = await fetch(`${baseUrl}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(newDiary),  
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const createdDiary: DiaryEntry = await response.json();
    console.log("Created Diary:", createdDiary);
    return createdDiary;
  } catch (error) {
    console.error("Error creating diary:", error);
    throw error;  
}
}