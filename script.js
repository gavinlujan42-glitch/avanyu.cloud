const form=document.getElementById('planBuilder');
const output=document.getElementById('builderOutput');
const emailLink=document.getElementById('emailLink');
const context=document.getElementById('contactContext');

document.querySelectorAll('[data-plan]').forEach(link=>link.addEventListener('click',()=>{
  const plan=link.dataset.plan;
  context.textContent=`Selected starting point: ${plan}. Tell us what you host today, what must improve, and your desired timeline.`;
  emailLink.href=`mailto:gavinlujan@gmail.com?subject=${encodeURIComponent(`Avanyu.cloud · ${plan}`)}`;
}));

form?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(form);
  const workloads=data.getAll('workload');
  const needs=data.getAll('need');
  const scale=data.get('scale');
  const workloadText=workloads.length?workloads.join(', '):'Workload discovery needed';
  const needsText=needs.length?needs.join(', '):'Requirements discovery needed';
  const brief=`Workloads: ${workloadText}. Needs: ${needsText}. Scale: ${scale}.`;
  output.classList.add('show');
  output.innerHTML=`<strong>YOUR STARTING BRIEF</strong><br>${brief}<br><br>We’ll use this to frame architecture, security, recovery, operations, and a transparent cost model.`;
  context.textContent=`Cloud brief ready: ${brief}`;
  emailLink.href=`mailto:gavinlujan@gmail.com?subject=${encodeURIComponent('Avanyu.cloud · Custom cloud brief')}&body=${encodeURIComponent(`I would like a cloud design session.\n\n${brief}\n\nCurrent environment / timeline:`)}`;
  emailLink.focus();
});

// New Mexico Water Conditions GIS
const mapElement=document.getElementById('waterMap');
if(mapElement&&window.L){
  const map=L.map(mapElement,{zoomControl:true,minZoom:5,maxZoom:14}).setView([34.45,-106.05],6);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(map);
  const layers={drought:L.layerGroup().addTo(map),rivers:L.layerGroup().addTo(map),reservoirs:L.layerGroup().addTo(map),springs:L.layerGroup().addTo(map),gages:L.layerGroup().addTo(map)};
  const panel=document.getElementById('featurePanel');
  const inspect=(type,name,details)=>{panel.innerHTML=`<span>${type}</span><h3>${name}</h3><p>${details}</p>`};
  const rivers=[
    {n:'Rio Grande',b:'Rio Grande Basin',p:[[36.99,-105.72],[36.55,-105.96],[36.20,-105.96],[35.69,-106.09],[35.17,-106.38],[35.09,-106.68],[34.47,-106.89],[33.12,-107.22],[32.00,-106.60]]},
    {n:'Rio Chama',b:'Rio Grande Basin',p:[[36.90,-106.61],[36.72,-106.57],[36.58,-106.72],[36.24,-106.44],[36.01,-106.06]]},
    {n:'Pecos River',b:'Pecos Basin',p:[[35.94,-105.65],[35.48,-105.68],[34.61,-104.39],[33.40,-104.52],[32.84,-104.42],[32.10,-104.47]]},
    {n:'San Juan River',b:'San Juan Basin',p:[[36.80,-107.70],[36.73,-108.21],[36.75,-108.69],[36.80,-109.04]]},
    {n:'Animas River',b:'San Juan Basin',p:[[36.99,-107.86],[36.73,-108.21]]},{n:'Canadian River',b:'Canadian Basin',p:[[36.86,-104.94],[36.47,-104.63],[35.42,-104.43],[35.17,-103.73],[35.38,-103.04]]},
    {n:'Gila River',b:'Gila Basin',p:[[33.20,-108.21],[33.06,-108.50],[32.85,-108.62],[32.72,-109.05]]},{n:'Rio Puerco',b:'Rio Grande Basin',p:[[36.04,-107.26],[35.36,-107.16],[34.76,-106.95],[34.42,-106.87]]},
    {n:'Rio Hondo',b:'Pecos Basin',p:[[33.32,-105.67],[33.32,-104.53]]},{n:'Rio Salado',b:'Rio Grande Basin',p:[[34.30,-106.53],[34.27,-106.90]]}
  ];
  rivers.forEach(r=>L.polyline(r.p,{color:'#55bce7',weight:r.n==='Rio Grande'?3:1.8,opacity:.82}).on('click',()=>inspect('RIVER / TRIBUTARY',r.n,`${r.b}<br>Generalized statewide hydrography reference.`)).addTo(layers.rivers));
  const waters=[['Navajo Reservoir',36.82,-107.61,'San Juan'],['Abiquiu Reservoir',36.24,-106.43,'Rio Chama'],['El Vado Lake',36.60,-106.74,'Rio Chama'],['Heron Lake',36.67,-106.70,'Rio Chama'],['Cochiti Lake',35.63,-106.32,'Rio Grande'],['Elephant Butte Reservoir',33.22,-107.20,'Rio Grande'],['Caballo Reservoir',32.90,-107.30,'Rio Grande'],['Conchas Lake',35.40,-104.19,'Canadian'],['Ute Reservoir',35.36,-103.44,'Canadian'],['Eagle Nest Lake',36.52,-105.26,'Cimarron'],['Santa Rosa Lake',35.03,-104.69,'Pecos'],['Brantley Lake',32.55,-104.38,'Pecos'],['Bluewater Lake',35.30,-108.11,'Rio Puerco'],['Sumner Lake',34.61,-104.39,'Pecos']];
  const springs=[['Ojo Caliente',36.31,-106.05],['Jemez Springs',35.77,-106.69],['Faywood Hot Springs',32.56,-107.99],['Montezuama Hot Springs',35.65,-105.29],['Soda Dam Springs',35.79,-106.69],['San Antonio Hot Springs',35.94,-106.65],['Black Rock Hot Springs',36.53,-105.71]];
  const icon=kind=>L.divIcon({className:'water-div-icon',html:`<span class="water-marker ${kind==='spring'?'spring-marker':''}"></span>`,iconSize:[14,14],iconAnchor:[7,7]});
  waters.forEach(w=>L.marker([w[1],w[2]],{icon:icon('water')}).on('click',()=>inspect('RESERVOIR / LAKE',w[0],`Connected system: <b>${w[3]}</b><br>Reference location; storage values require agency reservoir feeds.`)).addTo(layers.reservoirs));
  springs.forEach(s=>L.marker([s[1],s[2]],{icon:icon('spring')}).on('click',()=>inspect('SPRING',s[0],'Reference spring location. Verify access, flow, and water quality with the managing authority.')).addTo(layers.springs));
  document.getElementById('featureCount').textContent=rivers.length+waters.length+springs.length;
  document.querySelectorAll('[data-layer]').forEach(input=>input.addEventListener('change',()=>input.checked?layers[input.dataset.layer].addTo(map):map.removeLayer(layers[input.dataset.layer])));
  const basinViews={state:[[31.25,-109.35],[37.15,-102.75]],'rio-grande':[[31.8,-107.5],[37.1,-105.4]],pecos:[[31.8,-105.9],[36.2,-103.8]],'san-juan':[[36.45,-109.1],[37.05,-107.3]],canadian:[[34.8,-105.2],[37.1,-102.8]]};
  document.querySelectorAll('[data-basin]').forEach(btn=>btn.addEventListener('click',()=>map.fitBounds(basinViews[btn.dataset.basin],{padding:[20,20]})));
  map.fitBounds(basinViews.state,{padding:[8,8]});
  const droughtColors={'0':'#f2e3a4','1':'#f5c16c','2':'#ef8d4d','3':'#cf4946','4':'#812b49',D0:'#f2e3a4',D1:'#f5c16c',D2:'#ef8d4d',D3:'#cf4946',D4:'#812b49'};
  const droughtUrl='https://services5.arcgis.com/0OTVzJS4K09zlixn/arcgis/rest/services/USDM_current/FeatureServer/0/query?where=1%3D1&geometry=-109.1%2C31.3%2C-102.9%2C37.1&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=DM%2CDate&outSR=4326&f=geojson';
  fetch(droughtUrl).then(r=>{if(!r.ok)throw new Error('Drought layer unavailable');return r.json()}).then(geo=>{L.geoJSON(geo,{style:f=>({color:droughtColors[f.properties.DM]||'#d7aa64',fillColor:droughtColors[f.properties.DM]||'#d7aa64',weight:.6,fillOpacity:.3}),onEachFeature:(f,l)=>l.on('click',()=>inspect('U.S. DROUGHT MONITOR',`Category ${f.properties.DM}`,`Current weekly drought classification.<br>Valid date: <b>${f.properties.Date?new Date(f.properties.Date).toLocaleDateString():'latest release'}</b>`))}).addTo(layers.drought);layers.drought.bringToBack?.()}).catch(()=>{});
  const usgs='https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=NM&parameterCd=00060&siteStatus=active';
  fetch(usgs).then(r=>{if(!r.ok)throw new Error('USGS service unavailable');return r.json()}).then(data=>{
    const series=data?.value?.timeSeries||[];const flows=[];let newest='';
    series.forEach(item=>{const source=item.sourceInfo;const geo=source?.geoLocation?.geogLocation;const value=item.values?.[0]?.value?.at(-1);if(!geo||!value)return;const flow=Number(value.value);if(Number.isFinite(flow))flows.push(flow);if(value.dateTime>newest)newest=value.dateTime;const marker=L.marker([geo.latitude,geo.longitude],{icon:L.divIcon({className:'water-div-icon',html:'<span class="water-marker gage-marker"></span>',iconSize:[14,14],iconAnchor:[7,7]})});marker.on('click',()=>inspect('LIVE USGS STREAM GAGE',source.siteName,`Latest discharge: <b>${Number.isFinite(flow)?flow.toLocaleString():'—'} ft³/s</b><br>Observed ${new Date(value.dateTime).toLocaleString()}<br>USGS ${source.siteCode?.[0]?.value||''} · Provisional`));marker.addTo(layers.gages)});
    flows.sort((a,b)=>a-b);const median=flows.length?flows[Math.floor(flows.length/2)]:null;document.getElementById('gageCount').textContent=series.length.toLocaleString();document.getElementById('medianFlow').textContent=median===null?'—':median.toLocaleString();document.getElementById('waterStatus').textContent='Live USGS observations connected';document.getElementById('waterTimestamp').textContent=newest?`Latest network reading ${new Date(newest).toLocaleString()}`:'Current network response received';
  }).catch(()=>{document.getElementById('gageCount').textContent='Offline';document.getElementById('medianFlow').textContent='—';document.getElementById('waterStatus').textContent='Reference map active';document.getElementById('waterTimestamp').textContent='USGS live feed temporarily unavailable — retry on refresh';});
  setTimeout(()=>map.invalidateSize(),250);
}
