import { Component, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-not-found',
  imports: [RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private router = inject(Router);

  goBack () {
    const referer = document.referrer
    if (referer) {
      const url = new URL(referer)
      this.router.navigateByUrl(url.pathname)
    } else {
      this.router.navigate(['/']) // fallback
    }
  }
}
