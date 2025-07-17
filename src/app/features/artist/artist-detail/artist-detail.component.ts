import { Component, inject, Input, input, OnInit, Signal } from '@angular/core';
import { Artist } from '../../../shared/models/Artist';
import { PhonePipe } from '../../../shared/pipes/phone-number/phone.pipe';


@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  imports:[
    PhonePipe
  ],
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent{

  public artist = input.required<Artist>({alias: 'artist'})

}
