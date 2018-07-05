import { Injectable } from "@angular/core";

export type GtmData = {[key:string]:any};

@Injectable()
export class GtmService{
    public push(data: GtmData) {
        window['dataLayer'].push(data);
    }
    public trigger(event: string, data?: GtmData) {
        this.push({'event': 'name-of-event'});
    }
    constructor(){
        if( !Object.hasOwnProperty.call(window, 'dataLayer') ){
            throw new Error('`window.dataLayer` is not defined.')
        }
    }
}