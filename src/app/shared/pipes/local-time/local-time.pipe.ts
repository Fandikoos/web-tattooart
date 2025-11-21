import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {

  transform(timeString: string | undefined): string {
    if(!timeString) return '';
    //Eliminamos los segundos si existen
    return timeString.split(':').slice(0, 2).join(':');
  
  }

}
