// Bloqueios básicos no front: facilmente contornáveis por usuários avançados
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const block = (e.ctrlKey && ['u','s','p','c','x','i','j'].includes(e.key.toLowerCase())) || 
                (e.key === 'F12') || 
                (e.shiftKey && e.ctrlKey && ['i','j','c'].includes(e.key.toLowerCase()));
  if (block) e.preventDefault();
});
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
