/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import  { forwardRef, useImperativeHandle, useRef } from 'react'
import "./Modal.scss"

const Modal =forwardRef( ({children},ref) => {
    const dialogRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            openModal() {
                dialogRef.current.showModal();
            },
            closeModal(){
                dialogRef.current.close()
            }
        }
    })

  return (
    <>
    <dialog onCancel={()=>{dialogRef.current.closeModal()}}  onClose={() =>{dialogRef.current.closeModal()}}  ref={dialogRef}>
        {children}
        
    </dialog>
    </>
  )
})

export default Modal