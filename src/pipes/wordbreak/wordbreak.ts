import { Injectable,Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'wordbreak',
})
@Injectable()
export class WordbreakPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, limit :any) {
    // console.log(limit);
     if( value && value.length > limit){
      let s = value.substring(0, limit);
          s=s+'...';
          value=s;
    }
    return value;
  }
}
