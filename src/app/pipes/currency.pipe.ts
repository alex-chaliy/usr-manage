import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currencyCode: string = 'EUR'): string {
    const numericValue = Number(value ?? 0);

    if (!Number.isFinite(numericValue)) {
      return `${currencyCode} 0`;
    }

    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  }
}
