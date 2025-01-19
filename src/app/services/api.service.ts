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
    const headers = options.headers || new HttpHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers, params });
  }
}
