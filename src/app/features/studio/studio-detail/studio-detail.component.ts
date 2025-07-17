import { Component, effect, inject, OnInit } from '@angular/core';
import { ArtistService } from '../../../shared/services/artist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { StudioService } from '../../../shared/services/studio.service';
import { DatePipe } from '@angular/common';
import { LocalTimePipe } from '../../../shared/pipes/local-time/local-time.pipe';
import { ArtistDetailComponent } from "../../artist/artist-detail/artist-detail.component";
import { PhonePipe } from '../../../shared/pipes/phone-number/phone.pipe';
import { SwiperGalleryComponent } from "../../../shared/swiper-gallery/swiper-gallery.component";

@Component({
  selector: 'app-studio-detail',
  templateUrl: './studio-detail.component.html',
  imports: [
    LocalTimePipe,
    ArtistDetailComponent,
    SwiperGalleryComponent
],
  styleUrls: ['./studio-detail.component.css']
})
export class StudioDetailComponent implements OnInit {

  private artistService = inject(ArtistService);
  private studioService = inject(StudioService)
  private route = inject(ActivatedRoute);
  
  public artistsByStudio = toSignal(
    this.route.params.pipe(
      switchMap( ({id}) => this.artistService.getArtistByIdStudio(id))
    )
  );

  public studio = toSignal(
    this.route.params.pipe(
      switchMap( ({id}) => this.studioService.getById(id))
    )
  );

  constructor() {
    effect(() => {
      console.log(this.artistsByStudio());
      console.log(this.studio());
    })
   }

  ngOnInit() {
  }

}
