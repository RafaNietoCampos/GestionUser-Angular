import { Injectable } from '@angular/core'
import type { User, UserRole } from '@app/types/user'
import jsPDF, { type jsPDFOptions } from 'jspdf'
import autoTable from 'jspdf-autotable'

type PDFConfig = {
  title: string,
  filename: string,
  includeDate?: boolean
  options?: jsPDFOptions
}

@Injectable({ providedIn: 'root' })
export class PdfService {

  exportUsersToPdf (
    users: User[],
    config: PDFConfig = {
      title: 'Lista de usuarios',
      filename: 'users.pdf',
      options: {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      }
    }
  ) {

    const doc = new jsPDF(config.options)

    // Título
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(config.title, 14, 20)

    // Fecha
    if (config.includeDate) {
      doc.setFontSize(10)
      doc.text(
        `Generado: ${new Date().toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })}`,
        14, 30
      )
    }

    // Headers para TU User exactos
    const headers = ['Nombre', 'Rol', 'DNI', 'Dirección', 'Teléfono', 'Email', 'Estado',]

    // Filas formateadas
    const rows = users.map(user => [
      user.name,
      this.formatRole(user.role),
      user.dni,
      user.address,
      user.phone,
      user.email,
      user.active ? 'Habilitado' : 'Deshabilitado',
    ])

    autoTable(doc, {
      startY: config.includeDate ? 38 : 28,
      head: [headers],
      body: rows,

      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255]
      },

      margin: { top: 10, left: 10, right: 10 },

      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(120)
        doc.text(
          `Página ${data.pageNumber} de ${pageCount} | Total: ${users.length} usuarios`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 8,
          { align: 'center' }
        )
      }
    })

    doc.save(config.filename)
  }

  private formatRole (role: UserRole): string {
    const roleMap: Record<UserRole, string> = {
      admin: 'Administrador',
      usuario: 'Hermano',
      junta: 'Hermano de junta',
      capataz: 'Capataz',
    }
    return roleMap[role]
  }
}
