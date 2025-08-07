import {
  Button,
  DatePicker,
  Input,
  Listbox,
  ListboxItem,
  ListboxSection,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Loader, UploadCloud } from "lucide-react";
import React, { useState } from "react";

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-xs border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export const marketCategory = [
  { key: "REGULAR", label: "Regular" },
  { key: "CRYPTO", label: "Crypto" },
  { key: "SPORTS", label: "Sports" },
  { key: "POLITICS", label: "Politics" },
];

export const marketType = [
  { key: "BINARY", label: "Binary Outcomes" },
  { key: "OTHER", label: "Other Outcomes" },
];

interface Outcome {
  outcome: string;
  price: number;
  qty: number;
}

const CreateMarket = () => {
  const [selectedMarketType, setSelectedMarketType] = useState<
    "BINARY" | "OTHER"
  >("BINARY");
  const [otherOutcomes, setOtherOutcomes] = useState<Outcome[]>([]);
  const [outcome, setOutcome] = useState<string>("");
  // const [editIndex, setEditIndex] = useState<number | null>(null);

  const [marketTitle, setMarketTitle] = useState("");
  const [marketOverview, setMarketOverview] = useState("");
  const [marketSettlement, setMarketSettlement] = useState("");
  const [selectedMarketCategory, setSelectedMarketCategory] = useState("");
  const [endDateAndTime, setEndDateAndTime] = useState<number | null>(null);
  const [startDateAndTime, setStartDateAndTime] = useState<number | null>(null);

  const [fileUrl, setFileUrl] = useState<string>("");
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isFileUploadingError, setIsFileUploadingError] =
    useState<boolean>(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] =
    useState<string>("");
  const [isFileUploadingSuccess, setIsFileUploadingSuccess] =
    useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Upload thumbnail image
  const thumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (typeof file !== "object") {
      return;
    }

    const allowedFileTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];

    if (!allowedFileTypes.includes(file.type)) {
      window.alert("Invalid file type");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsFileUploading(true);

      const sendReq = await fetch(
        "http://localhost:8000/api/v0/admin/thumbnail-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        setFileUrl(res.fileUrl);
        setIsFileUploadingSuccess(true);
        setIsFileUploading(false);
      } else {
        setIsFileUploading(false);
        setIsFileUploadingError(true);
        setFileUploadErrorMessage(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsFileUploading(false);
    }
  };

  // Handle form sbmission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("hola");

    const binaryOutcomes: Outcome[] = [
      { outcome: "YES", price: 0, qty: 0 },
      { outcome: "NO", price: 0, qty: 0 },
    ];




    try {
      const sendReq = await fetch( "http://localhost:8000/api/v0/admin/create-market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({title: marketTitle, overview: marketOverview, settlement: marketSettlement, marketCategory: selectedMarketCategory,marketType: selectedMarketType, thumbnailImageUrl: fileUrl, marketStarts: startDateAndTime, marketEnds: endDateAndTime, binaryOutcomes})
      })

      const res = await sendReq.json()
      console.log(res);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <form
        className="flex max-w-6xl mx-auto gap-4"
        onSubmit={handleFormSubmit}
      >
        {/* Left side */}
        <div className="space-y-4 w-full">
          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Market Title
                </span>
              </label>
            </div>
            <Input
              type="text"
              placeholder="Enter market title"
              label="Market title"
              labelPlacement="inside"
              variant="bordered"
              required
              onChange={(e) => setMarketTitle(e.target.value)}
            />
          </div>

          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Market Overview
                </span>
              </label>
            </div>
            <Textarea
              placeholder="Enter market overview"
              label="Market overview"
              labelPlacement="inside"
              variant="bordered"
              required
              onChange={(e) => setMarketOverview(e.target.value)}
            />
          </div>
          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Market Settlement
                </span>
              </label>
            </div>
            <Textarea
              placeholder="Enter market settlement"
              label="Market settlement"
              labelPlacement="inside"
              variant="bordered"
              required
              onChange={(e) => setMarketSettlement(e.target.value)}
            />
          </div>

          {/* Date and Time picker area */}
          <div>
            <div>
              <label htmlFor="Start date">
                <span className="text-sm font-semibold text-gray-500">
                  Select Start Date & Time
                </span>
              </label>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  label="Market start date"
                  labelPlacement="inside"
                  variant="bordered"
                  isRequired
                  onChange={(e) => {
                    const date = new Date(
                      e!.year,
                      e!.month - 1,
                      e!.day,
                      e!.hour,
                      e!.minute,
                      0,
                      0
                    );
                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                    setStartDateAndTime(unixTimestamp);
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="End date">
                <span className="text-sm font-semibold text-gray-500">
                  Select End Date & Time
                </span>
              </label>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  label="Market end date"
                  labelPlacement="inside"
                  variant="bordered"
                  isRequired
                  onChange={(e) => {
                    const date = new Date(
                      e!.year,
                      e!.month - 1,
                      e!.day,
                      e!.hour,
                      e!.minute,
                      0,
                      0
                    );
                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                    setEndDateAndTime(unixTimestamp);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full space-y-4">
          <div className="max-w-xs">
            {isFileUploadingSuccess ? (
              <>
                <div className="mt-1 max-w-xs">
                  <p className="text-sm font-semibold text-gray-500">
                    Thumbnail image
                  </p>
                  <img
                    src={fileUrl}
                    alt="thumbnail"
                    className="rounded-lg object-contain w-20 h-20"
                  />

                  <div className="mt-1">
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setFileUrl("");
                        setIsFileUploadingSuccess(false);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="Thumbnail Image">
                    <span className="text-sm font-semibold text-gray-500 flex items-center">
                      Thumbnail Image
                      {isFileUploading && (
                        <>
                          uploading...
                          <Loader size={16} className="animate-spin" />
                        </>
                      )}
                    </span>
                  </label>
                </div>
                <Input
                  type="file"
                  label="Upload thumbnail"
                  variant="bordered"
                  isRequired
                  startContent={<UploadCloud />}
                  onChange={thumbnailUpload}
                />
                <div>
                  {isFileUploadingError && (
                    <p className="text-xs text-red-500 font-semibold">
                      {fileUploadErrorMessage}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="max-w-xs">
            <div>
              <label htmlFor="Market category">
                <span className="text-sm font-semibold text-gray-500">
                  Select Market category
                </span>
              </label>
            </div>
            <Select
              label="Market category"
              placeholder="Select market category"
              selectionMode="single"
              variant="bordered"
              isRequired
              onChange={(e) => setSelectedMarketCategory(e.target.value)}
            >
              {marketCategory.map((mrktCrgry) => (
                <SelectItem key={mrktCrgry.key}>{mrktCrgry.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="max-w-xs">
            <div>
              <label htmlFor="Market type">
                <span className="text-sm font-semibold text-gray-500">
                  Select Market type
                </span>
              </label>
            </div>

            <Select
              label="Market type"
              placeholder="Select market type"
              selectionMode="single"
              variant="bordered"
              defaultSelectedKeys={["BINARY"]}
              isRequired
              onChange={(e) => {
                setSelectedMarketType(e.target.value as "BINARY" | "OTHER");
              }}
            >
              {marketType.map((mrktType) => (
                <SelectItem key={mrktType.key}>{mrktType.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Outcome section */}
          <div>
            <div>
              <label htmlFor="Outcomes">
                <span className="text-sm font-semibold text-gray-500">
                  Outcomes for {selectedMarketType.toLowerCase()} outcome market
                </span>
              </label>
            </div>

            {selectedMarketType === "BINARY" ? (
              <>
                <ListboxWrapper>
                  <Listbox
                    aria-label="Listbox with binary outcomes"
                    variant="light"
                  >
                    <ListboxSection title={"Outcomes"}>
                      <ListboxItem className="hover:cursor-text">
                        1. Yes
                      </ListboxItem>
                      <ListboxItem className="hover:cursor-text">
                        2. No
                      </ListboxItem>
                    </ListboxSection>
                  </Listbox>
                </ListboxWrapper>
              </>
            ) : (
              <>
                <ListboxWrapper>
                  <Listbox
                    aria-label="Listbox with other outcomes"
                    variant="light"
                  >
                    <ListboxSection title={"Outcomes"}>
                      {otherOutcomes.length === 0 ? (
                        <ListboxItem className="hover:cursor-text text-gray-500">
                          Please add outcomes
                        </ListboxItem>
                      ) : (
                        <>
                          {otherOutcomes.map((mltoutcms, i) => (
                            <ListboxItem key={i} className="hover:cursor-text">
                              {`${i + 1}. ${mltoutcms.outcome}`}
                            </ListboxItem>
                          ))}
                        </>
                      )}
                    </ListboxSection>
                  </Listbox>
                  <div>
                    <Button
                      onPress={onOpen}
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      Add outcomes
                    </Button>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                      <ModalContent>
                        <>
                          <ModalHeader className="font-semibold text-gray-500">
                            Add outcomes
                          </ModalHeader>
                          <ModalBody>
                            {otherOutcomes.map((mltoutcms, i) => (
                              <div key={i}>
                                <p
                                // onClick={() => {
                                //   setOutcome(
                                //     otherOutcomes.filter(
                                //       (_, idx) => idx === i
                                //     )[0].outcome
                                //   );
                                //   setEditIndex(i);
                                // }}
                                >{`${i + 1}. ${mltoutcms.outcome}`}</p>
                              </div>
                            ))}
                          </ModalBody>
                          <ModalFooter>
                            <Input
                              type="text"
                              placeholder="Add outcome"
                              size="sm"
                              value={outcome}
                              onChange={(e) => {
                                setOutcome(e.target.value);
                              }}
                            />
                            <Button
                              variant="flat"
                              color="primary"
                              size="sm"
                              className="font-semibold px-6"
                              onPress={() => {
                                if (outcome.length === 0) {
                                  return;
                                }
                                setOtherOutcomes((prev) => [
                                  ...prev,
                                  { outcome: outcome, price: 0, qty: 0 },
                                ]);
                                setOutcome("");
                              }}
                            >
                              Add outcome
                            </Button>
                          </ModalFooter>
                        </>
                      </ModalContent>
                    </Modal>
                  </div>
                </ListboxWrapper>
              </>
            )}
          </div>
          {/* FORM SUBMISSION BUTTON */}
          <div className="mt-4 max-w-xs">
            <Button type="submit" className="w-full" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMarket;
