import { CommonModule } from '@angular/common'
import { Component, computed, effect, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { ArrowIcon } from "@app/components/icons/arrow"
import type { User } from '@app/types/user'

const usersMock: Array<User> = [
  {
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@empresa.com',
    role: 'admin',
    active: true,
    id: 1,
    dni: '12345678A',
    address: 'Calle Mayor 12, 15701 Santiago de Compostela',
    phone: '+34 981 123 456',
    createDate: new Date('2025-01-01')
  },
  {
    name: 'Elena Wu',
    email: 'elena.wu@empresa.com',
    role: 'capataz',
    active: true,
    id: 2,
    dni: '87654321B',
    address: 'Rúa Nova 45, 15703 Santiago de Compostela',
    phone: '+34 982 987 654',
    createDate: new Date('2025-03-01')
  },
  {
    name: 'Raj Patel',
    email: 'raj.patel@empresa.com',
    role: 'junta',
    active: false,
    id: 3,
    dni: '11223344C',
    address: 'Praza do Obradoiro 3, 15705 Santiago',
    phone: '+34 600 123 456',
    createDate: new Date('2025-04-23')
  },
  {
    name: 'Sarah Miller',
    email: 'sarah.miller@empresa.com',
    role: 'junta',
    active: true,
    id: 4,
    dni: '44332211D',
    address: 'Avda. Rodrigo de Padrón 67, 15706 Santiago',
    phone: '+34 981 555 777',
    createDate: new Date('2025-04-01')
  },
  {
    name: 'David Okafor',
    email: 'david.okafor@empresa.com',
    role: 'usuario',
    active: true,
    id: 5,
    dni: '99887766E',
    address: 'Rúa do Franco 22, 15707 Santiago',
    phone: '+34 699 444 333',
    createDate: new Date('2025-04-01')
  },
  // 10 usuarios adicionales (role: 'usuario')
  {
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    role: 'usuario',
    active: true,
    id: 6,
    dni: '55667788F',
    address: 'Rúa do Vilar 18, 15701 Santiago',
    phone: '+34 981 222 111',
    createDate: new Date('2025-05-15')
  },
  {
    name: 'Ahmed Khalil',
    email: 'ahmed.khalil@empresa.com',
    role: 'usuario',
    active: true,
    id: 7,
    dni: '33445566G',
    address: 'Calle San Clemente 9, 15702 Santiago',
    phone: '+34 650 777 888',
    createDate: new Date('2025-06-10')
  },
  {
    name: 'Lucía Fernández',
    email: 'lucia.fernandez@empresa.com',
    role: 'usuario',
    active: false,
    id: 8,
    dni: '77889900H',
    address: 'Praza da Quintana 5, 15704 Santiago',
    phone: '+34 982 333 444',
    createDate: new Date('2025-07-02')
  },
  {
    name: 'Javier López',
    email: 'javier.lopez@empresa.com',
    role: 'usuario',
    active: true,
    id: 9,
    dni: '00112233I',
    address: 'Rúa Raiña 33, 15705 Santiago',
    phone: '+34 689 555 666',
    createDate: new Date('2025-08-20')
  },
  {
    name: 'Sofia Petrova',
    email: 'sofia.petrova@empresa.com',
    role: 'usuario',
    active: true,
    id: 10,
    dni: '22334455J',
    address: 'Calle Azcarraga 14, 15706 Santiago',
    phone: '+34 981 999 000',
    createDate: new Date('2025-09-12')
  },
  {
    name: 'Miguel Ángel',
    email: 'miguel.angel@empresa.com',
    role: 'usuario',
    active: true,
    id: 11,
    dni: '44556677K',
    address: 'Rúa das Orfas 27, 15707 Santiago',
    phone: '+34 612 111 222',
    createDate: new Date('2025-10-05')
  },
  {
    name: 'Aisha Mohammed',
    email: 'aisha.mohammed@empresa.com',
    role: 'usuario',
    active: true,
    id: 12,
    dni: '66778899L',
    address: 'Praza da Peregrina 8, 15701 Santiago',
    phone: '+34 647 333 444',
    createDate: new Date('2025-11-18')
  },
  {
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@empresa.com',
    role: 'usuario',
    active: true,
    id: 13,
    dni: '88990011M',
    address: 'Rúa do Toural 16, 15703 Santiago',
    phone: '+34 981 666 777',
    createDate: new Date('2025-12-03')
  },
  {
    name: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    role: 'usuario',
    active: false,
    id: 14,
    dni: '11223344N',
    address: 'Calle Montero Río 41, 15704 Santiago',
    phone: '+34 698 888 999',
    createDate: new Date('2026-01-15')
  },
  {
    name: 'Diego Rivera',
    email: 'diego.rivera@empresa.com',
    role: 'usuario',
    active: true,
    id: 15,
    dni: '33445566O',
    address: 'Rúa Nova de Abaixo 29, 15705 Santiago',
    phone: '+34 943 222 333',
    createDate: new Date('2026-02-01')
  }
]

@Component({
  selector: 'app-sections',
  imports: [CommonModule, FormsModule, ArrowIcon, SearchBoxComponent],
  templateUrl: './sections.html',
  styleUrl: './sections.css',
})
export class Sections {
  availableUsers = signal<Array<User>>(usersMock.slice(0, 12));
  assignedUsers: User[] = usersMock.slice(12);

  searchQuery = '';
  selectedStep = 'Paso Cristo';

  assignUser (user: User) {
    this.availableUsers.set(this.availableUsers().filter(u => u.id !== user.id))
    this.assignedUsers.push(user)
  }

  unassignUser (user: User) {
    this.assignedUsers = this.assignedUsers.filter(u => u.id !== user.id)
    this.availableUsers.set([...this.availableUsers(), user])
  }

  private timer?: ReturnType<typeof setTimeout>

  constructor() {
    effect(() => {
      this.availableUsersFiltered.set(this.availableUsers() || [])
    })
  }

  searchTerm = signal('');
  private availableUsersFiltered = signal<Array<User>>([]);

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.availableUsersFiltered()

    return this.availableUsersFiltered().filter(user =>
      user.email.toLowerCase().includes(term) ||
      user.name.toLowerCase().includes(term)
    )
  });

  onInput (value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value) // ← Actualiza signal
    }, 150)
  }
}
