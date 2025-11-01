// src/services/aiService.ts
export interface AskRequest {
  query: string;
  project_id: string;
  num_results?: number;
}

export interface Context {
  text: string;
  source: string;
  title?: string | null;
}

export interface AskResponse {
  question: string;
  answer: string;
  contexts: Context[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

const API_BASE_URL = "http://localhost:6066/api/ai-analyze";

export async function askAssistant({ query, project_id, num_results = 1 }: AskRequest): Promise<AskResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, project_id, num_results }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    const data: AskResponse = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error calling AI Assistant API:", error);
    throw error;
  }
}

  const API_BASE_URL2 = "http://localhost:8081";


export async function loginUser({ email, password }: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL2}/auth/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Login API error:", error);
    throw error;
  }
}


