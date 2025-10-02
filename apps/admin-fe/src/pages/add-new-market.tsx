import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DatePicker,
  Form,
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
import { useNavigate } from "react-router";
import { MarketSchema } from "@repo/shared/src";
import { BACKEND_URI } from "../store/adminStore";

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export const marketCategory = [
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

const AddNewMarket = () => {
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Upload thumbnail image
  const thumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formSubmitingError);
    console.log(isFormSubmiting);

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

      const sendReq = await fetch(`${BACKEND_URI}/admin/thumbnail-upload`, {
        method: "POST",
        body: formData,
      });

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
      marketType: selectedMarketType,
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

    const validatedData = validateMarketData.data;

    try {
      setIsFormSubmiting(true);
      const sendReq = await fetch(`${BACKEND_URI}/admin/create-market`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validatedData),
      });

      const res = await sendReq.json();
      if (res.success) {
        setIsFormSubmiting(false);
        router("/admin/console");
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
      <Card className="max-w-3xl mx-auto py-2">
        <CardHeader>
          <Chip radius="md" variant="dot" color="secondary">
            <span className="font-semibold text-xs">Create new market</span>
          </Chip>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleFormSubmit}>
            <div className="w-full flex flex-col">
              <Input
                type="text"
                label="Title"
                labelPlacement="outside"
                placeholder="Enter market title"
                variant="faded"
                isRequired
                size="lg"
                onChange={(e) => setMarketTitle(e.target.value)}
              />
              <Textarea
                type="text"
                label="Overview"
                labelPlacement="outside"
                placeholder="Enter market overview"
                variant="faded"
                size="lg"
                isRequired
                onChange={(e) => setMarketOverview(e.target.value)}
              />
              <Textarea
                type="text"
                label="Settlement"
                labelPlacement="outside"
                placeholder="Enter market settlement"
                variant="faded"
                size="lg"
                isRequired
                onChange={(e) => setMarketSettlement(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row gap-2">
              <div className="flex flex-col w-full">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  label="Market starts"
                  labelPlacement="outside"
                  variant="faded"
                  size="lg"
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
                <p>
                  {startDateError.length > 0 && (
                    <span className="text-red-500 text-sm">
                      {startDateError}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col w-full">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  label="Market ends"
                  labelPlacement="outside"
                  variant="faded"
                  size="lg"
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
                <p>
                  {endDateError.length > 0 && (
                    <span className="text-red-500 text-sm">{endDateError}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-2">
              {isFileUploadingSuccess ? (
                <>
                  <div className="w-full">
                    <p className="text-sm font-semibold text-gray-500">
                      Thumbnail image
                    </p>
                    <div className="flex">
                      <img
                        src={fileUrl}
                        alt="thumbnail"
                        className="rounded-lg object-contain w-20 h-20"
                      />
                      <div>
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
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex flex-col">
                    <Input
                      type="file"
                      label="Thumbnail"
                      labelPlacement="outside"
                      variant="faded"
                      size="lg"
                      isRequired
                      startContent={<UploadCloud />}
                      onChange={thumbnailUpload}
                    />
                    <p className="text-sm font-semibold text-gray-500 flex items-center">
                      {isFileUploading && (
                        <>
                          uploading...
                          <Loader size={16} className="animate-spin" />
                        </>
                      )}
                      {isFileUploadingError && (
                        <p className="text-xs text-red-500 font-semibold">
                          {fileUploadErrorMessage}
                        </p>
                      )}
                    </p>
                  </div>
                </>
              )}
              <div className="w-full">
                <Select
                  label="Market category"
                  labelPlacement="outside"
                  placeholder="Select market category"
                  selectionMode="single"
                  size="lg"
                  variant="faded"
                  isRequired
                  onChange={(e) => setSelectedMarketCategory(e.target.value)}
                >
                  {marketCategory.map((mrktCrgry) => (
                    <SelectItem key={mrktCrgry.key}>
                      {mrktCrgry.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="w-full">
                <Select
                  label="Market type"
                  labelPlacement="outside"
                  placeholder="Select market type"
                  selectionMode="single"
                  variant="faded"
                  size="lg"
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
              <div className="w-full">
                <div>
                  <label htmlFor="Outcomes">
                    <span className="text-sm font-semibold text-gray-500">
                      Outcomes for {selectedMarketType.toLowerCase()} outcome
                      market
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
                          color="secondary"
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
                                    <p className="capitalize">{`${i + 1}. ${mltoutcms.outcome}`}</p>
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
            </div>
            <div className="w-full mt-2">
              <Button className="w-full" type="submit" color="secondary">
                Submit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddNewMarket;
