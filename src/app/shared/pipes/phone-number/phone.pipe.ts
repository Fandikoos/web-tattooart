import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  private phoneString = '';

  transform(phone: number | undefined | null): string {
    if(phone === undefined || phone === null || isNaN(phone)){
      return '';
    }

    let phoneString = phone.toString();

     // Formatear el número en grupos de 3 dígitos separados por espacios
    const formattedNumber = phoneString.replace(/(\d{3})(?=\d)/g, '$1 ');
    return `+34 ${formattedNumber}`;
  }

}
