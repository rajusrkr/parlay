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
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import {
  type MarketTypeInterface,
  MarketCreationSchema,
} from "@repo/shared/src";
import { Loader, UploadCloud } from "lucide-react";
import { useState } from "react";
import { BACKEND_URI } from "../store/adminStore";

export const marketCategory = [
  { key: "crypto", label: "Crypto" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
];
export const marketType = [
  { key: "binary", label: "Binary Outcomes" },
  { key: "other", label: "Other Outcomes" },
];
export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function MarketCreationForm() {
  const [formData, setFormData] = useState<MarketTypeInterface>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);
  const [singleOutcome, setSingleOutcome] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsImageUploading(true);
      const sendReq = await fetch(`${BACKEND_URI}/admin/thumbnail-upload`, {
        method: "POST",
        body: formData,
      });
      const res = await sendReq.json();
      if (res.success) {
        setFormData((prev) => ({ ...prev!, thumbnailImage: res.fileUrl }));
        setIsImageUploaded(true);
        setIsImageUploading(false);
      } else {
        setIsImageUploading(false);
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const { success, data, error } = MarketCreationSchema.safeParse(formData);

    if (!success) {
      console.log("Zod validation error");
      console.log(error);
      return;
    }

    // Compare dates
    const currentDateAndTime = Math.floor(new Date().getTime() / 1000);
    if (data!.marketStarts < currentDateAndTime) {
      setErrorMessage("Start date and time should not be in past");
      return;
    }

    if (
      data!.marketEnds < currentDateAndTime ||
      data!.marketEnds < data!.marketStarts
    ) {
      setErrorMessage(
        "End date and time should not be in future or should greater than Start date and time"
      );
      return;
    }

    try {
      setIsFormSubmiting(true);
      const sendReq = await fetch(`${BACKEND_URI}/admin/create-market`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const res = await sendReq.json();
      if (res.success) {
        setIsFormSubmiting(false);
        // router("/");
      } else {
        setIsFormSubmiting(false);
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className="max-w-3xl mx-auto py-2">
        <CardHeader>
          <Chip radius="md" variant="dot" color="secondary">
            <span className="font-semibold text-xs">Add new market</span>
          </Chip>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleFormSubmit}>
            {/* Text input fields,  Title, Description, Settlement*/}
            <div className="w-full flex flex-col">
              <Input
                label="Title"
                type="text"
                labelPlacement="outside"
                placeholder="Enter market title"
                variant="faded"
                isRequired
                size="lg"
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev!, title: e.target.value }));
                }}
              />
              <Textarea
                type="text"
                label="Description"
                labelPlacement="outside"
                placeholder="Enter market description"
                variant="faded"
                size="lg"
                isRequired
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }));
                }}
              />
              <Textarea
                type="text"
                label="Settlement"
                labelPlacement="outside"
                placeholder="Enter market settlement"
                variant="faded"
                size="lg"
                isRequired
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev!,
                    settlement: e.target.value,
                  }));
                }}
              />
            </div>
            {/* Time inputs, Start date and End date */}
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
                    // setStartDateError("");
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
                    setFormData((prev) => ({
                      ...prev!,
                      marketStarts: unixTimestamp,
                    }));
                  }}
                />
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
                    setFormData((prev) => ({
                      ...prev!,
                      marketEnds: unixTimestamp,
                    }));
                  }}
                />
              </div>
            </div>
            {/* Image upload and market category */}
            <div className="w-full flex flex-col md:flex-row gap-2">
              {isImageUploaded ? (
                <>
                  <div className="w-full">
                    <p className="text-sm font-semibold text-gray-500">
                      Thumbnail image
                    </p>
                    <div className="flex">
                      {formData?.thumbnailImage.length !== 0 && (
                        <img
                          src={formData?.thumbnailImage}
                          alt="thumbnail"
                          className="rounded-lg object-contain w-20 h-20"
                        />
                      )}
                      <div>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            setFormData((prev) => ({
                              ...prev!,
                              thumbnailImage: "",
                            }));
                            setIsImageUploaded(false);
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
                      onChange={handleImageUpload}
                    />
                    <p className="text-sm font-semibold text-gray-500 flex items-center">
                      {isImageUploading && (
                        <>
                          uploading...
                          <Loader size={16} className="animate-spin" />
                        </>
                      )}
                      {isImageUploading && (
                        <span className="text-xs text-red-500 font-semibold">
                          {errorMessage}
                        </span>
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
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev!,
                      marketCategory: e.target.value as
                        | "sports"
                        | "politics"
                        | "crypto"
                        | "regular",
                    }));
                  }}
                >
                  {marketCategory.map((mrktCrgry) => (
                    <SelectItem key={mrktCrgry.key}>
                      {mrktCrgry.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* Market type and outcomes */}
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="w-full">
                <Select
                  label="Market type"
                  labelPlacement="outside"
                  placeholder="Select market type"
                  selectionMode="single"
                  variant="faded"
                  size="lg"
                  isRequired
                  onChange={(e) => {
                    console.log(e.target.value);

                    if (e.target.value === "binary") {
                      setFormData((prev) => ({
                        ...prev!,
                        marketType: e.target.value as "binary" | "other",
                        outcomes: [
                          { outcome: "yes", price: "0", tradedQty: 0 },
                          { outcome: "no", price: "0", tradedQty: 0 },
                        ],
                      }));
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev!,
                      marketType: e.target.value as "binary" | "other",
                      outcomes: [],
                    }));
                  }}
                >
                  {marketType.map((mrktType) => (
                    <SelectItem key={mrktType.key}>{mrktType.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-full">
                {/* Outcomes for binary market type */}
                <div>
                  {formData?.marketType === "binary" && (
                    <ListboxWrapper>
                      <Listbox
                        aria-label="Listbox with binary outcomes"
                        variant="light"
                      >
                        <ListboxSection
                          title={`Outcomes for ${formData.marketType} market`}
                        >
                          {formData.outcomes.map((otcm, i) => (
                            <ListboxItem key={i}>
                              <span className="capitalize">{`${1 + i}. ${otcm.outcome}`}</span>
                            </ListboxItem>
                          ))}
                        </ListboxSection>
                      </Listbox>
                    </ListboxWrapper>
                  )}
                </div>
                {/* Outcomes for other */}
                <div>
                  {formData?.marketType === "other" && (
                    <>
                      <ListboxWrapper>
                        <Listbox
                          aria-label="Listbox with binary outcomes"
                          variant="light"
                        >
                          <ListboxSection
                            title={`Outcomes for ${formData.marketType} market`}
                          >
                            {formData.outcomes.length === 0 ? (
                              <>
                                <ListboxItem>
                                  <span className="capitalize">
                                    Add outcomes
                                  </span>
                                </ListboxItem>
                              </>
                            ) : (
                              <>
                                {formData.outcomes.map((otcm, i) => (
                                  <ListboxItem key={i}>
                                    <span className="capitalize">
                                      <span className="capitalize">{`${1 + i}. ${otcm.outcome}`}</span>
                                    </span>
                                  </ListboxItem>
                                ))}
                              </>
                            )}
                          </ListboxSection>
                          <ListboxSection>
                            <ListboxItem>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add outcomes"
                                  className="w-48"
                                  isRequired
                                  variant="bordered"
                                  onChange={(e) =>
                                    setSingleOutcome(e.target.value)
                                  }
                                />
                                <Button
                                  color="secondary"
                                  variant="flat"
                                  onPress={() => {
                                    setFormData((prev) => ({
                                      ...prev!,
                                      outcomes: [
                                        ...prev!.outcomes,
                                        {
                                          outcome: singleOutcome,
                                          price: "0",
                                          tradedQty: 0,
                                        },
                                      ],
                                    }));
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </ListboxItem>
                          </ListboxSection>
                        </Listbox>
                      </ListboxWrapper>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              {errorMessage.length !== 0 && (
                <p className="text-sm text-danger font-semibold">
                  Error: {errorMessage}
                </p>
              )}
            </div>
            <div className="w-full mt-2">
              <Button
                className="w-full"
                type="submit"
                color="secondary"
                disabled={isFormSubmiting}
              >
                Submit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
