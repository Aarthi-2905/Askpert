function Modal({ isOpen, onClose, title, description, iconSrc, onConfirm, confirmText }) {
    if (!isOpen) return null;
    return (
        <Modal show={isOpen} onClose={onClose} popup size="lg">
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <h1 className="text-black font-bold text-xl">{title}</h1>
                    <h3 className="mb-5 text-lg text-black m-9 mt-5 font-semibold">{description}</h3>
                    {iconSrc && <img src={iconSrc} alt="Icon" className="mx-auto mb-5 h-20 w-20 object-contain" />}
                    <div className="flex justify-center gap-4 m-5">
                        <Button className="text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-gradient-to-br
                          focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                        <Button color="gray" onClick={onClose}>
                            No, Cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default function ConfirmationModal;
