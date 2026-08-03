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
