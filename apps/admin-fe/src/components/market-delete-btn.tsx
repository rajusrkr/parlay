import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@heroui/react"
import { Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BACKEND_URI } from "../constants";

export default function MarketDeleteBtn({ title, marketId }: { title: string, marketId: string }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [deleteError, setdeleteError] = useState("")

    const navigate = useNavigate()



    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const sendReq = await fetch(`${BACKEND_URI}/admin/delete-market?marketId=${marketId}`, {
                method: "DELETE",
                credentials: "include"
            })

            const res = await sendReq.json()
            if (res.success) {
                setIsLoading(false)
                navigate("/")
            } else {
                setIsLoading(false)
                setdeleteError(res.message)
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }
    return (
        <div>
            <Button onPress={onOpen} color="danger" size="sm" className="font-semibold"><span className="flex items-center gap-0.5"><Trash size={"14"} className="mb-0.5" /> Delete this market</span></Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" hideCloseButton>
                <ModalContent>
                    {
                        (onClose) => (
                            <>
                                <ModalHeader>Delete confirmation</ModalHeader>

                                <ModalBody>
                                    <p className="font-semibold text-gray-600">Deleting this will clean all Positions & Orders related to this market.</p>
                                    <p className="font-semibold text-gray-600">
                                        Are you sure you want to delete <span className="capitalize font-semibold underline text-primary">{title}?</span>
                                    </p>

                                    <p className="text-sm text-red-600">{deleteError.length > 0 && "Delete Error: {deleteError}"}</p>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="danger" variant="flat" size="sm" onPress={handleDelete} disabled={isLoading}>{isLoading ? (<Spinner />) : "Yes, confirm"}</Button>
                                    <Button color="primary" variant="flat" size="sm" onPress={onClose} disabled={isLoading}>No</Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}