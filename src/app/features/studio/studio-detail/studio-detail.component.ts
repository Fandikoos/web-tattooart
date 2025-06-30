import { Component, effect, inject, OnInit } from '@angular/core';
import { ArtistService } from '../../../shared/services/artist.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-studio-detail',
  templateUrl: './studio-detail.component.html',
  styleUrls: ['./studio-detail.component.css']
})
export class StudioDetailComponent implements OnInit {

  private artistService = inject(ArtistService);
  
  private artistsByStudio$ = this.artistService.getArtistByIdStudio(7);
  public artistsByStudio = toSignal(this.artistsByStudio$);

  constructor() {
    effect(() => {
      console.log(this.artistsByStudio())
    })
   }

  ngOnInit() {
  }

}
