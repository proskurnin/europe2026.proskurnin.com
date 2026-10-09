'use client';
import {cloudStorage,storageEvent} from '@/lib/server-storage';
import {lazy,Suspense,useSyncExternalStore} from 'react';
import type {ComponentProps} from 'react';
import type GoogleMapType from './google-trip-map';
const GoogleMap=lazy(()=>import('./google-trip-map'));
const OsmMap=lazy(()=>import('./osm-trip-map'));
const preference='europe2026-map-provider';
function snapshot(){try{return cloudStorage.getItem(preference)==='osm'?'osm':'google'}catch{return 'google'}}
function subscribe(fn:()=>void){window.addEventListener(storageEvent,fn);window.addEventListener('map-provider-change',fn);return()=>{window.removeEventListener(storageEvent,fn);window.removeEventListener('map-provider-change',fn)}}
export default function TripMap(props:ComponentProps<typeof GoogleMapType>){
 const provider=useSyncExternalStore(subscribe,snapshot,()=> 'google');
 function choose(value:string){try{cloudStorage.setItem(preference,value)}catch{}window.dispatchEvent(new Event('map-provider-change'))}
 return <div className="map-frame"><div className="map-switch" role="group" aria-label="Картографический сервис"><span>Наша карта</span><button aria-pressed={provider==='google'} onClick={()=>choose('google')}>Google Maps</button><button aria-pressed={provider==='osm'} onClick={()=>choose('osm')}>OpenStreetMap</button></div><Suspense fallback={<div className="mapwrap map-loading">Разворачиваем карту…</div>}>{provider==='google'?<GoogleMap {...props}/>:<OsmMap {...props}/>}</Suspense></div>
}
