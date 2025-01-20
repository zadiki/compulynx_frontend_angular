import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
