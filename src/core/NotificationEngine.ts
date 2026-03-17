export const notificar = (hash: string) => {

 if(Notification.permission==="granted"){

  new Notification(
   "Obra registrada",
   {body:`Hash: ${hash}`}
  )

 }

}
