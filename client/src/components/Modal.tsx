import { ReactNode } from "react";

interface ModalProps {
    handleClose: () => void;
    show: boolean;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal fixed block w-full h-full left-0 top-0' : 'modal hidden';

    return (
        <div className={ showHideClassName }>
            <section className="fixed flex flex-col items-center justify-around top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3.5 h-1/3.5 p-4 bg-white rounded-lg">
                <div className="p-2">
                    { children }
                </div>
                <button className="rounded-lg p-3 bg-green-700 w-1/3" type="button" onClick={ handleClose }>
                    Close
                </button>
            </section>
        </div>
    );
}

export default Modal;
