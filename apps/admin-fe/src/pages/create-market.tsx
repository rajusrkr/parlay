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
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Loader, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { MarketSchema } from "types/src/index";

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-xs border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export const marketCategory = [
  { key: "regular", label: "Regular" },
  { key: "crypto", label: "Crypto" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
];

export const marketType = [
  { key: "binary", label: "Binary Outcomes" },
  { key: "other", label: "Other Outcomes" },
];

interface Outcome {
  outcome: string;
  price: string;
  tradedQty: number;
}

const CreateMarket = () => {
  const [selectedMarketType, setSelectedMarketType] = useState<
    "binary" | "other"
  >("binary");

  const [otherOutcomes, setOtherOutcomes] = useState<Outcome[]>([]);
  const [outcome, setOutcome] = useState<string>("");
  // const [editIndex, setEditIndex] = useState<number | null>(null);

  const [marketTitle, setMarketTitle] = useState("");
  const [marketOverview, setMarketOverview] = useState("");
  const [marketSettlement, setMarketSettlement] = useState("");
  const [selectedMarketCategory, setSelectedMarketCategory] = useState("");

  // Time fields
  const time = now(getLocalTimeZone());
  const date = Math.floor(
    new Date(
      time.year,
      time.month - 1,
      time.day,
      time.hour,
      time.minute
    ).getTime() / 1000
  );
  const [endDateAndTime, setEndDateAndTime] = useState<number>(date);
  const [startDateAndTime, setStartDateAndTime] = useState<number>(date);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const [fileUrl, setFileUrl] = useState<string>("");
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isFileUploadingError, setIsFileUploadingError] =
    useState<boolean>(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] =
    useState<string>("");
  const [isFileUploadingSuccess, setIsFileUploadingSuccess] =
    useState<boolean>(false);

  // Form submiting
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);
  const [formSubmitingError, setFormSubmitingError] = useState("");

  // Redirect
  const router = useNavigate();

  // URI
  const BACKEND_URI = import.meta.env.VITE_PLATFORM_API_URI

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
      "image/jpg",
      "image/webp",
      "image/gif",
    ];

    if (!allowedFileTypes.includes(file.type)) {
      window.alert(`Invalid file type, ${file.type} not allowed`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsFileUploading(true);

      const sendReq = await fetch(
        `${BACKEND_URI}/admin/thumbnail-upload`,
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

    const binaryOutcomes: Outcome[] = [
      { outcome: "yes", price: "0", tradedQty: 0 },
      { outcome: "no", price: "0", tradedQty: 0 },
    ];

    const marketData = {
      title: marketTitle,
      overview: marketOverview,
      settlement: marketSettlement,
      marketCategory: selectedMarketCategory,
      thumbnailImageUrl: fileUrl,
      marketStarts: startDateAndTime,
      marketEnds: endDateAndTime,
      outcomes:
        selectedMarketType === "binary" ? binaryOutcomes : otherOutcomes,
    };
    // Compare dates
    const currentDateAndTime = Math.floor(new Date().getTime() / 1000);

    if (startDateAndTime < currentDateAndTime) {
      setStartDateError("Start date and time should not be in past");
      return;
    }

    if (
      endDateAndTime < currentDateAndTime ||
      endDateAndTime < startDateAndTime
    ) {
      setEndDateError(
        "End date and time should not be in past or should greater than Start date and time"
      );
      return;
    }

    // return
    const validateMarketData = MarketSchema.safeParse(marketData);

    if (!validateMarketData.success) {
      console.log(validateMarketData.error.message);
      return;
    }

    try {
      setIsFormSubmiting(true);
      const sendReq = await fetch(
        `${BACKEND_URI}/admin/create-market`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(marketData),
        }
      );

      const res = await sendReq.json();
      if (res.success) {
        setIsFormSubmiting(false);
        router("/");
      } else {
        setIsFormSubmiting(false);
        setFormSubmitingError(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsFormSubmiting(false);
    }
  };

  return (
    <div className="py-4 px-10">
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
                  {"Select Start Date & Time ( MM/DD/YYYY, HH:MM )"}
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
                    setStartDateError("");
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

                <div>
                  {startDateError.length > 0 && (
                    <p className="text-red-500 text-sm">{startDateError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="End date">
                <span className="text-sm font-semibold text-gray-500">
                  {"Select End Date & Time ( MM/DD/YYYY, HH:MM )"}
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
                    setEndDateError("");
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
                <div>
                  {endDateError.length > 0 && (
                    <p className="text-red-500 text-sm">{endDateError}</p>
                  )}
                </div>
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
              defaultSelectedKeys={["binary"]}
              isRequired
              onChange={(e) => {
                setSelectedMarketType(e.target.value as "binary" | "other");
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

            {selectedMarketType === "binary" ? (
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
                            <ListboxItem
                              key={i}
                              className="hover:cursor-text capitalize"
                            >
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

                                  className="capitalize"
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
                                  {
                                    outcome: outcome.toLowerCase(),
                                    price: "0",
                                    tradedQty: 0,
                                  },
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
            <Button
              type="submit"
              className="w-full"
              color="primary"
              disabled={isFormSubmiting}
            >
              {isFormSubmiting ? <Spinner /> : "Submit"}
            </Button>
          </div>
          <div>
            {formSubmitingError.length > 0 && (
              <p className="text-red-500 text-sm">{formSubmitingError}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMarket;
