import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removelogin',
    pure: false
})
export class RemoveLoginPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {

        return items.filter(item => item.indexOf(filter) === -1);
    }
}
