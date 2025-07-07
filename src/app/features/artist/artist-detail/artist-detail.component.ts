import { Component, inject, Input, input, OnInit, Signal } from '@angular/core';
import { Artist } from '../../../shared/models/Artist';


@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent{

  public artist = input.required<Artist>({alias: 'artist'})

}
