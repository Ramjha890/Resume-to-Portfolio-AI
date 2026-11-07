import { AuthResponse, User, Resume, Portfolio, PortfolioData, AdminStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await res.json();
      errorMsg = data.detail || data.message || errorMsg;
    } catch {
      errorMsg = res.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

// Auth API
export const authApi = {
  async register(full_name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<User>(res);
  },
};

// Resumes API
export const resumeApi = {
  async upload(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<Resume>(res);
  },

  async getAll(): Promise<Resume[]> {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Resume[]>(res);
  },

  async getById(id: number): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Resume>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete resume');
  },
};

// AI API
export const aiApi = {
  async analyzeResume(resumeId?: number, rawText?: string): Promise<{
    success: boolean;
    structured_resume: any;
    recommended_template: string;
  }> {
    const res = await fetch(`${API_BASE}/ai/analyze-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ resume_id: resumeId, raw_text: rawText }),
    });
    return handleResponse(res);
  },

  async generatePortfolio(payload: {
    resume_id?: number;
    structured_resume?: any;
    target_role?: string;
    preferred_template?: string;
  }): Promise<{
    portfolio_name: string;
    template_id: string;
    portfolio_data: PortfolioData;
  }> {
    const res = await fetch(`${API_BASE}/ai/generate-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async improveText(field: string, original_text: string, tone = 'professional'): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/improve-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ field, original_text, tone }),
    });
    const data = await handleResponse<{ field: string; improved_text: string }>(res);
    return data.improved_text;
  },
};

// Portfolios API
export const portfolioApi = {
  async getAll(): Promise<Portfolio[]> {
    const res = await fetch(`${API_BASE}/portfolios`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Portfolio[]>(res);
  },

  async getById(id: number): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Portfolio>(res);
  },

  async create(data: {
    portfolio_name: string;
    slug?: string;
    template_id: string;
    portfolio_data: PortfolioData;
  }): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Portfolio>(res);
  },

  async update(id: number, data: Partial<Portfolio>): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Portfolio>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/portfolios/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete portfolio');
  },

  async publish(id: number): Promise<{ success: boolean; is_published: boolean; slug: string; public_url: string }> {
    const res = await fetch(`${API_BASE}/portfolios/${id}/publish`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async unpublish(id: number): Promise<{ success: boolean; is_published: boolean }> {
    const res = await fetch(`${API_BASE}/portfolios/${id}/unpublish`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async duplicate(id: number): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${id}/duplicate`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Portfolio>(res);
  },

  getExportZipUrl(id: number): string {
    return `${API_BASE}/portfolios/${id}/export-zip`;
  },
};

// Public API
export const publicApi = {
  async getPublicPortfolio(slug: string): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/public/portfolio/${slug}`);
    return handleResponse<Portfolio>(res);
  },
};

// Admin API
export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AdminStats>(res);
  },

  async getUsers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getPortfolios(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/portfolios`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};
