import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../model/apiResponse.model';
import { Contact } from '../model/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api';

  constructor(private http: HttpClient, private auth: AuthService) { }

  async getContacts(page = 0, size = 10): Promise<ApiResponse<Contact[]>> {
    const token = this.auth.getToken();
    if (!token) throw new Error('Token não encontrado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'pt-br',
      'Content-Type': 'application/json'
    });

    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: 'name,asc' // <-- ordenando por nome
    };

    return await firstValueFrom(
      this.http.get<ApiResponse<Contact[]>>(`${this.apiUrl}/contact`, { headers, params })
    );
  }

  async toggleFavorite(contact: Contact) {
    const token = this.auth.getToken(); // pegue seu token atual
    if (!token) {
      console.error('Token JWT não encontrado');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'pt-br'
    });

    const endpoint = contact.favorite
      ? `${this.apiUrl}/contact/unfavorite/${contact.identifier}`
      : `${this.apiUrl}/contact/favorite/${contact.identifier}`;

    try {
      await firstValueFrom(this.http.patch(endpoint, null, { headers }));
      contact.favorite = !contact.favorite;
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  }

  async getContactByIdentifier(id: string): Promise<ApiResponse<Contact>> {
    const token = this.auth.getToken();
    if (!token) throw new Error('Token não encontrado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'pt-br'
    });

    return await firstValueFrom(
      this.http.get<ApiResponse<Contact>>(`${this.apiUrl}/contact/${id}`, { headers })
    );
  }

  async updateContact(contact: Contact): Promise<void> {
    const token = this.auth.getToken();
    if (!token) throw new Error('Token não encontrado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'pt-br',
      'Content-Type': 'application/json'
    });

    const payload = {
      name: contact.name,
      email: contact.email,
      cellphone: contact.cellphone,
      phone: contact.phone
    };

    await firstValueFrom(
      this.http.put(`${this.apiUrl}/contact/${contact.identifier}`, payload, { headers })
    );
  }
}