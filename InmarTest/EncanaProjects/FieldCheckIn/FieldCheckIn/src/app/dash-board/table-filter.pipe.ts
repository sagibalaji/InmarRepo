import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(list: any[], filters: Object) {
    if (!list) return [];
    if (!filters) return list;
    const keys = Object.keys(filters).filter(key => filters[key]);
    const filterDate = data => keys.every(key => data[key] === filters[key]);
    return keys.length ? list.filter(filterDate) : list;
  }

}
