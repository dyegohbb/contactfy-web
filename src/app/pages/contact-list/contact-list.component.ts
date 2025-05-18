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
  isCreating = false;

  selectedContact?: Contact;
  isModalOpen = false;
  isEditing = false;
  isLoadingContact = false;
  originalContactJson: string = '';
  showConfirmDialog = false;
  confirmTitle = '';
  confirmMessage = '';
  showFilters = false;

  filters: any = {
    identifier: null,
    name: null,
    email: null,
    cellphone: null,
    phone: null,
    favorite: null,
    active: true,
    createdAfter: null,
    createdBefore: null
  };
  
  sort: string = 'name';
  direction: 'asc' | 'desc' = 'asc';

  private confirmCallback: () => void = () => { };


  showDropdown = false;

  constructor(private contactService: ContactService, private router: Router) { }

  ngOnInit(): void {
    this.loadContacts();
    this.loadUntilScrollable();
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
        await this.loadContacts(force);
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

  async loadContacts(ignoreNextPage = false) {
    if ((this.loading || !this.hasNextPage) && !ignoreNextPage) return;
  
    this.loading = true;
  
    try {
      
      let response = await this.contactService.getContacts(
        this.page,
        this.size,
        this.filters,
        this.sort,
        this.direction
      );
  
      if(response != null){
        this.contacts = [...this.contacts, ...response.content || []];
        this.hasNextPage = response.hasNextPage || false;
      } else {
        this.hasNextPage = false;
      }

      this.page++;
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
    this.loading = false;
  
  }  

  clearFilters() {
    this.filters = {
      identifier: null,
      name: null,
      email: null,
      cellphone: null,
      phone: null,
      favorite: null,
      active: true,
      createdAfter: null,
      createdBefore: null
    };
    this.sort = 'name';
    this.direction = 'asc';
    this.hasNextPage = true;
    this.refreshList();
  }

  toggleSort(field: string) {
    if (this.sort === field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = field;
      this.direction = 'asc';
    }
  
    this.refreshList();
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

  async deactivateContact(contact: Contact) {
    if (!contact.active) return;

    try {
      await this.contactService.toggleActive(contact);
      this.closeModal();
      this.refreshList();
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar:', error);
    }
   
  }

  async viewContactDetails(contact: Contact) {
    this.isCreating = false;
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
    this.selectedContact = {
      identifier: '',
      name: '',
      email: '',
      cellphone: '',
      phone: '',
      favorite: false,
      active: true,
      createdAt: new Date().toISOString()
    };
    this.isModalOpen = true;
    this.isCreating = true;
    this.isEditing = true;
  }

  async addContact() {
    if (!this.selectedContact) return;

    try {
      await this.contactService.createContact(this.selectedContact);
      this.isModalOpen = false;
      this.refreshList();
    } catch (error) {
      console.error('Erro ao criar contato:', error);
    }
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

  cancelEdit() {
    this.isEditing = false;

    if (this.isCreating) {
      this.isModalOpen = false;
    }
  }

  openConfirmDialog(title: string, message: string, onConfirm: () => void) {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmCallback = onConfirm;
    this.showConfirmDialog = true;
  }
  
  cancelConfirm() {
    this.showConfirmDialog = false;
    this.confirmCallback = () => {};
  }
  
  confirmAction() {
    this.showConfirmDialog = false;
    this.confirmCallback();
    this.confirmCallback = () => {};
  }
  
  confirmDeactivate(contact: Contact) {
    this.openConfirmDialog(
      'Confirmar desativação',
      'Tem certeza que deseja desativar este contato?',
      () => this.deactivateContact(contact)
    );
  }
  
  confirmUpdateContact() {
    this.openConfirmDialog(
      'Confirmar alteração',
      'Deseja salvar as alterações deste contato?',
      () => this.updateContact()
    );
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  

}