export const checkpointSave = (state: any) => {

 const db = indexedDB.open("arkhe")

 db.onupgradeneeded = (e: any) => {

  e.target.result.createObjectStore(
   "checkpoints",
   {keyPath:"id"}
  )

 }

 db.onsuccess = (e: any) => {

  const tx = e.target.result
   .transaction("checkpoints","readwrite")

  tx.objectStore("checkpoints")
   .add({
    id: Date.now(),
    state
   })

 }

}
