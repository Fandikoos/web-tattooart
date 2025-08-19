import { Component, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  imports:[
    GoogleMap
  ],
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnChanges {

  public optionsMap!: google.maps.MapOptions;
  public center = input.required<google.maps.LatLngLiteral>({alias: 'map_center'});
  public zoom = input.required<number>();
  public streetViewControl = input<boolean>();

  ngOnChanges(): void {
    this.optionsMap = {
      center: this.center(),
      zoom: this.zoom(),
      streetViewControl: this.streetViewControl()
    }  
  }

}
