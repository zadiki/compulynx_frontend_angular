import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  post(endpoint: string, data: any, options: any = {}) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, options);
  }

  get(endpoint: string, params: any = {}, options: any = {}) {
    params = cleanupParams(params);
    const headers = options.headers || new HttpHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers, params });
  }
  getExcel(endpoint: string, params: any = {}, options: any = {}) {
    params = cleanupParams(params);
    const headers = options.headers || new HttpHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      headers,
      params,
      responseType: 'blob',
    });
  }

  put(endpoint: string, data: any, options: any = {}) {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, params: any = {}, options: any = {}) {
    const headers = options.headers || new HttpHeaders();
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers, params });
  }
}
interface Params {
  [key: string]: any;
}

function cleanupParams(params: Params): Params {
  const cleanedParams = { ...params };

  for (const key in cleanedParams) {
    if (
      cleanedParams[key] == null ||
      cleanedParams[key] == 'null' ||
      cleanedParams[key] == ''
    ) {
      delete cleanedParams[key];
    }
  }

  return cleanedParams;
}
