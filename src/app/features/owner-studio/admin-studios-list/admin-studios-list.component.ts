import { Component, inject, OnInit, signal } from '@angular/core';
import { StudioService } from '../../../core/services/studio.service';
import { TokenService } from '../../../core/services/token.service';
import { Studio } from '../../../shared/models/interfaces/Studio';
import { AdminStudioDataEditComponent } from './admin-studio-edit/admin-studio-data-edit.component';

@Component({
  selector: 'app-admin-studios-list',
  templateUrl: './admin-studios-list.component.html',
  styleUrls: ['./admin-studios-list.component.css'],
  imports: [AdminStudioDataEditComponent],
})
export class AdminStudiosListComponent implements OnInit {
  private studioService = inject(StudioService);
  private tokenService = inject(TokenService);
  studios = signal<Studio[]>([]);
  editStudio: boolean = false;
  studioToEdit = signal<Studio | undefined>(undefined);

  constructor() { }

  ngOnInit() {
    const idAdmin = this.tokenService.getProfileUserDto()?.idUser;
    if (idAdmin != null) {
      this.studioService.findByIdAdmin(idAdmin).subscribe((data) => {
        this.studios.set(data);
      });
    }
  }

  deleteStudio(idStudio: number) {
    if (!confirm('Are you sure than you want to delete this studio?')) return;

    this.studioService.delete(idStudio).subscribe(() => {
      this.studios.update((studios) =>
        studios.filter((studio) => studio.idStudio !== idStudio),
      );
    });
  }

  onEditFinished(studioToCreateOrEdit: Studio | undefined) {
    if (studioToCreateOrEdit) {
      this.studios.update((studios) => {
        const exists = studios.some(
          (s) => s.idStudio === studioToCreateOrEdit.idStudio,
        );
        if (exists) {
          return studios.map((s) =>
            s.idStudio === studioToCreateOrEdit.idStudio
              ? studioToCreateOrEdit
              : s,
          );
        } else {
          return [...studios, studioToCreateOrEdit];
        }
      });
    }
    this.editStudio = false;
    this.studioToEdit.set(undefined);
  }

  prepareEditStudio(studio: Studio) {
    this.studioToEdit.set(studio);
    this.editStudio = true;
  }

  prepareAddStudio() {
    this.studioToEdit.set(undefined);
    this.editStudio = true;
  }
}
