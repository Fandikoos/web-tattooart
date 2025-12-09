import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ArtistService } from '../../../shared/services/artist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StudioService } from '../../../shared/services/studio.service';
import { LocalTimePipe } from '../../../shared/pipes/local-time/local-time.pipe';
import { ArtistDetailComponent } from "../../artist/artist-detail/artist-detail.component";
import { TokenService } from '../../../shared/services/token.service';
import { MatDialog } from "@angular/material/dialog";
import { MatDialogGalleryComponent } from '../../../shared/components/mat-dialog-gallery/mat-dialog-gallery.component';
import { MatDialogReviewsComponent } from '../../../shared/components/mat-dialog-reviews/mat-dialog-reviews.component';

@Component({
  selector: 'app-studio-detail',
  templateUrl: './studio-detail.component.html',
  imports: [
    LocalTimePipe,
    ArtistDetailComponent,
  ],
  styleUrls: ['./studio-detail.component.css']
})
export class StudioDetailComponent implements OnInit {

  private artistService = inject(ArtistService);
  private studioService = inject(StudioService);
  public tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);

  isAdmin: boolean = false;

  constructor(private matDialog: MatDialog) { }

  idStudio = toSignal(
    this.route.params.pipe(map(params => Number(params["id"])))
  );

  ngOnInit() {
    this.isAdmin = this.tokenService.isAdmin();
  }

  artistsByStudio = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.artistService.getArtistByIdStudio(id))
    )
  );

  studio = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.studioService.getById(id))
    )
  );

  centerMap = computed(() => {
    const st = this.studio();
    if (!st) return { lat: 0, lng: 0 };

    return {
      lat: st.latitud ?? 0,
      lng: st.longitud ?? 0
    };
  });

  images = computed(() => {
    const studio = this.studio();
    console.log(studio?.imagesGallery);
    return studio?.imagesGallery;
  })


  openGallery(): void {
    this.matDialog.open(MatDialogGalleryComponent, {
      data: this.images(),
      width: '90vw',
      maxWidth: '1100px',
      height: '80vh',
      maxHeight: '900px',
      panelClass: 'gallery-modal',
    });
  }

  openReviews() {
    this.matDialog.open(MatDialogReviewsComponent, {
      data: this.studio()?.reviews,
      width: '90vw',
      maxWidth: '1100px',
      height: '80vh',
      maxHeight: '900px',
      panelClass: 'gallery-modal',
    });
  }

}
