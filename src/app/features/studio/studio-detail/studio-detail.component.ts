import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { GoogleMapsComponent } from "../../../shared/google-maps/google-maps.component";
import { TokenService } from '../../../shared/services/token.service';

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
  public centerMap = signal<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  isAdmin: boolean = false;

  ngOnInit() {
    this.isAdmin = this.tokenService.isAdmin();
  }
  
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
    if(this.studio()?.latitud != undefined && this.studio()?.longitud != undefined){
      this.centerMap().lat != this.studio()?.latitud;
      this.centerMap().lng != this.studio()?.longitud;
    }
   }

}
