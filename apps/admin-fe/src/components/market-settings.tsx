import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react"
import { Settings } from "lucide-react"
import MarketDeleteBtn from "./market-delete-btn"
import MarketUpdateTabs from "./market-update-tabs"
import type { MarketData } from "types/src/index"

export default function MarketSettings({ marketData }: { marketData: MarketData}) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div>
            <Chip onClick={onOpen} color="primary" className="hover:cursor-pointer">
                <span className="flex gap-0.5 items-center font-semibold"><Settings size={"18"} />Controlls</span>
            </Chip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton size="2xl" >
                <ModalContent>
                    {
                        (onClose) => (
                            <>
                                <ModalHeader className="flex items-center justify-between">
                                    <div>
                                        <p>Market controlls</p>
                                    </div>
                                    <div>
                                        <MarketDeleteBtn title={marketData.marketTitle} marketId={marketData.marketId} />
                                    </div>
                                </ModalHeader>

                                <ModalBody>
                                   <MarketUpdateTabs marketData={marketData}/>
                                </ModalBody>

                                <ModalFooter>
                                    <Button onPress={onClose} size="sm" color="danger" variant="flat">
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}