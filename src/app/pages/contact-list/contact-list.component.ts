import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../../model/contact.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact-list.component.html',
})
export class ContactListComponent {
  contacts: Contact[] = [];
  page = 0;
  size = 10;
  loading = false;
  hasNextPage = true;
  loadError = false;

  selectedContact?: Contact;
  isModalOpen = false;
  isEditing = false;
  isLoadingContact = false;
  originalContactJson: string = '';

  showDropdown = false;

  constructor(private contactService: ContactService, private router: Router) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.contacts = [];
    this.page = 0;
    this.loadUntilScrollable(true);
  }

  async loadUntilScrollable(force = false) {
    let firstLoop = true;
    this.loadError = false;

    while ((this.hasNextPage && !this.isScrollable()) || (force && firstLoop)) {
      try {
        await this.loadContacts();
      } catch (error) {
        console.error('Erro ao carregar contatos:', error);
        this.loadError = true;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
      firstLoop = false;
    }
  }

  isScrollable(): boolean {
    return document.body.scrollHeight > window.innerHeight;
  }

  async loadContacts() {
    if (this.loading || !this.hasNextPage) return;

    this.loading = true;

    try {
      let response = await this.contactService.getContacts(this.page, this.size);
      this.contacts = [...this.contacts, ...response.content || []];
      this.hasNextPage = response.hasNextPage || false;
      this.page++;
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }

    this.loading = false;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    let scrollY = window.scrollY;
    let height = window.innerHeight;
    let bodyHeight = document.body.offsetHeight;

    if (scrollY + height >= bodyHeight - 100) {
      this.loadContacts();
    }
  }

  async toggleFavorite(contact: Contact) {
    try {
      await this.contactService.toggleFavorite(contact);
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar:', error);
    }
  }

  deactivateContact(contact: Contact) {
    if (!contact.active) return;
    contact.active = false;
  }

  async viewContactDetails(contact: Contact) {
    this.isModalOpen = true;
    this.isEditing = false;
    this.isLoadingContact = true;
    this.selectedContact = undefined;

    try {
      let response = await this.contactService.getContactByIdentifier(contact.identifier);
      this.selectedContact = response.content;
      this.originalContactJson = JSON.stringify(this.selectedContact);
    } catch (error) {
      console.error('Erro ao buscar detalhes do contato:', error);
    }

    this.isLoadingContact = false;
  }

  formatDate(dateString: string): string {
    let date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  async updateContact() {
    if (!this.selectedContact) return;

    try {
      await this.contactService.updateContact(this.selectedContact);
      this.isEditing = false;
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
    }
  }

  createNewContact() {
    console.log('Novo contato...');
  }

  closeModal() {
    let current = JSON.stringify(this.selectedContact);
    let changed = current !== this.originalContactJson;

    this.isModalOpen = false;
    this.isEditing = false;
    this.selectedContact = undefined;
    this.originalContactJson = '';

    if (changed) {
      this.refreshList();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}