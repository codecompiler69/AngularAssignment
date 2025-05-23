import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, properties: string[]): any[] {
    if (!items || !searchText || !properties || properties.length === 0) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      return properties.some((prop) => {
        const value = this.getPropertyValue(item, prop);
        return value && value.toString().toLowerCase().includes(searchText);
      });
    });
  }

  private getPropertyValue(item: any, property: string): any {
    const props = property.split('.');
    let value = item;

    for (const prop of props) {
      if (value && value[prop] !== undefined) {
        value = value[prop];
      } else {
        return undefined;
      }
    }

    return value;
  }
}
