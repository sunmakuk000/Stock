import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDel',
  pure: false
})

export class IsDelPipe implements PipeTransform {

  transform(value: any[]): any {
    return value.filter(f => f.Isdel == false);
  }
}
