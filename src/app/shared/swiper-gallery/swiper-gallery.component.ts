import { Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { StudioImage } from '../models/StudioImage';
register();

@Component({
  selector: 'app-swiper-gallery',
  templateUrl: './swiper-gallery.component.html',
  styleUrls: ['./swiper-gallery.component.css'],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SwiperGalleryComponent implements OnInit {

  public images = input.required<StudioImage[] | undefined>({alias: 'imagesForSwiper'});

  constructor() { }

  ngOnInit() {
  }

}
