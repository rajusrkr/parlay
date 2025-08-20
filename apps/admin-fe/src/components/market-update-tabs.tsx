import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  DatePicker,
  Image,
  Input,
  Listbox,
  ListboxItem,
  ListboxSection,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { CalendarDateTime } from "@internationalized/date";
import { Edit, Loader, Save, Send, Trash } from "lucide-react";
import { useRef, useState } from "react";
import type { MarketData } from "types/src/index";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";


import {
  ListboxWrapper,
  marketCategory,
  marketType,
} from "../pages/create-market";

const tabNamesAndFields = [
  { key: "general", title: "General" },
  { key: "dateAndTime", title: "Date & Time" },
  { key: "typeAndCategory", title: "Type & Category" },
  { key: "status", title: "Status" },
];

export const marketStatus = [
  { key: "not_started", label: "Will open" },
  { key: "open", label: "Open" },
  { key: "settled", label: "Settled" },
  { key: "cancelled", label: "Cancell" },
];

export default function MarketUpdateTabs({
  marketData,
}: {
  marketData: MarketData;
}) {
  const [newData, setNewData] = useState<MarketData>(cloneDeep(marketData));


  const [selectedTab, setSelectedTab] = useState(tabNamesAndFields[0].key);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isFileUploadingError, setIsFileUploadingError] =
    useState<boolean>(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] =
    useState<string>("");
  const [outcome, setOutcome] = useState("")
  const [editingOutcome, setEditingOutcome] = useState("")

  const [editingIndex, setEditingIndex] = useState<number | null>(null)


  const startDate = new Date(newData.marketStarts * 1000);
  const endDate = new Date(newData.marketEnds * 1000);

  const fileRef = useRef<HTMLInputElement | null>(null);
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFileSelection = () => {
    fileRef.current?.click();
  };
  const BACKEND_URI = import.meta.env.VITE_PLATFORM_API_URI;

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
      setIsFileUploadingError(false);
      const sendReq = await fetch(`${BACKEND_URI}/admin/thumbnail-upload`, {
        method: "POST",
        body: formData,
      });

      const res = await sendReq.json();

      if (res.success) {
        setIsFileUploading(false);
        setNewData({ ...newData, [e.target.name]: res.fileUrl });
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

  const handleMarketDataChange = () => {
    const finalData: any = {};

    for (const key of Object.keys(newData) as (keyof MarketData)[]) {
      // const typedData = data as keyof MarketData;

      if (!isEqual(newData[key], marketData[key])) {
        finalData[key] = newData[key];
      }
    }
    console.log(finalData);
    return;
  };

  return (
    <div>
      <Tabs
        aria-label="Market controll tabs"
        selectedKey={selectedTab}
        onSelectionChange={(e) => setSelectedTab(e.toString())}
        isVertical
      >
        {tabNamesAndFields.map((tbsNms) => (
          <Tab key={tbsNms.key} title={tbsNms.title}>
            <Card className="h-[480px] w-md">
              <CardBody className="scrollbar-hide overflow-y-auto">
                {/* If tab is general */}
                {tbsNms.key === "general" && (
                  <>
                    <div>
                      <div className="flex gap-4">
                        {/* Title */}
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
                            name="marketTitle"
                            placeholder="Enter market title"
                            label="Market title"
                            labelPlacement="inside"
                            variant="bordered"
                            defaultValue={newData.marketTitle}
                            required
                            onChange={(e) =>
                              setNewData({
                                ...newData,
                                [e.target.name]: e.target.value,
                              })
                            }
                          />
                        </div>
                        {/* Thumbnail image */}
                        <div>
                          <div>
                            <label htmlFor="Market settlement">
                              <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                Thumbnail Image{" "}
                                <span>
                                  {isFileUploading && (
                                    <>
                                      <Loader
                                        className="animate-spin"
                                        size={"18"}
                                      />
                                    </>
                                  )}
                                </span>
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center gap-4">
                            <Image
                              src={newData.thumbnailImage}
                              width={50}
                              height={50}
                              className="w-50 h-50 rounded-full object-contain"
                            />

                            <Input
                              type="file"
                              className="hidden"
                              name="thumbnailImage"
                              ref={fileRef}
                              label="Upload thumbnail"
                              onChange={thumbnailUpload}
                            />

                            <Chip
                              color="primary"
                              variant="light"
                              className="hover:bg-gray-100 hover:cursor-pointer"
                              onClick={handleFileSelection}
                            >
                              Upload new
                            </Chip>
                            <div>
                              {
                                isFileUploadingError && (<p>{fileUploadErrorMessage}</p>)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Market overview */}
                      <div>
                        <div>
                          <label htmlFor="Market overview">
                            <span className="text-sm font-semibold text-gray-500">
                              Market Overview
                            </span>
                          </label>
                        </div>
                        <Textarea
                          type="text"
                          name="marketOverview"
                          placeholder="Enter market overview"
                          label="Market overview"
                          labelPlacement="inside"
                          variant="bordered"
                          defaultValue={newData.marketOverview}
                          required
                          onChange={(e) =>
                            setNewData({
                              ...newData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Market settlement */}
                      <div>
                        <div>
                          <label htmlFor="Market settlement">
                            <span className="text-sm font-semibold text-gray-500">
                              Market Settlement
                            </span>
                          </label>
                        </div>
                        <Textarea
                          type="text"
                          name="marketSettlement"
                          placeholder="Enter market settlement"
                          label="Market settlement"
                          labelPlacement="inside"
                          variant="bordered"
                          defaultValue={newData.marketSettlement}
                          required
                          onChange={(e) =>
                            setNewData({
                              ...newData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* If tab is date and time */}
                {tbsNms.key === "dateAndTime" && (
                  <>
                    <div className="space-y-4">
                      {/* Market start date */}
                      <div>
                        <div>
                          <label htmlFor="Start date">
                            <span className="text-sm font-semibold text-gray-500">
                              {"Update Start Date & Time ( MM/DD/YYYY, HH:MM )"}
                            </span>
                          </label>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-full">
                            <DatePicker
                              hideTimeZone
                              showMonthAndYearPickers
                              defaultValue={
                                new CalendarDateTime(
                                  startDate.getFullYear(),
                                  Number(startDate.getMonth()) + 1,
                                  startDate.getDate(),
                                  startDate.getHours(),
                                  startDate.getMinutes()
                                )
                              }
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
                                const unixTimestamp = Math.floor(
                                  date.getTime() / 1000
                                );
                                setNewData({
                                  ...newData,
                                  marketStarts: unixTimestamp,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Market end field */}
                      <div>
                        <div>
                          <label htmlFor="End date">
                            <span className="text-sm font-semibold text-gray-500">
                              {"Update End Date & Time ( MM/DD/YYYY, HH:MM )"}
                            </span>
                          </label>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-full">
                            <DatePicker
                              hideTimeZone
                              showMonthAndYearPickers
                              defaultValue={
                                new CalendarDateTime(
                                  endDate.getFullYear(),
                                  endDate.getMonth() + 1,
                                  endDate.getDate(),
                                  endDate.getHours(),
                                  endDate.getMinutes()
                                )
                              }
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
                                const unixTimestamp = Math.floor(
                                  date.getTime() / 1000
                                );
                                setNewData({
                                  ...newData,
                                  marketEnds: unixTimestamp,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* If tab is type and category */}
                {tbsNms.key === "typeAndCategory" && (
                  <>
                    <div className="space-y-4">
                      {/* Market category */}
                      <div>
                        <div>
                          <label htmlFor="Market category">
                            <span className="text-sm font-semibold text-gray-500">
                              Select Market category
                            </span>
                          </label>
                        </div>
                        <Select
                          label="Market category"
                          name="marketCategory"
                          placeholder="Select market category"
                          selectionMode="single"
                          variant="bordered"
                          defaultSelectedKeys={[newData.marketCategory]}
                          isRequired
                          onChange={(e) => {
                            setNewData({ ...newData, marketCategory: e.target.value })
                          }}
                        >
                          {marketCategory.map((mrktCrgry) => (
                            <SelectItem key={mrktCrgry.key}>
                              {mrktCrgry.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      {/* Market type */}
                      <div>
                        <div>
                          <div>
                            <label htmlFor="Market type">
                              <span className="text-sm font-semibold text-gray-500">
                                Select Market type
                              </span>
                            </label>
                          </div>

                          <Select
                            label="Market type"
                            name="marketType"
                            placeholder="Select market type"
                            selectionMode="single"
                            variant="bordered"
                            defaultSelectedKeys={[newData.marketType]}
                            isRequired
                            onChange={(e) => {
                              setNewData({
                                ...newData,
                                [e.target.name]: e.target.value,
                              });
                            }}
                          >
                            {marketType.map((mrktType) => (
                              <SelectItem key={mrktType.key}>
                                {mrktType.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>

                      {/* Show outcomes */}
                      <div>
                        {newData.marketType === "binary" ? (
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
                            <Card>
                              <CardHeader>
                                Outcomes
                              </CardHeader>
                              <CardBody>
                                {
                                  newData.outcomesAndPrices.map((otcmsAndPrice, i) => (
                                    < div key={i}>
                                      {
                                        editingIndex === i ? (<>
                                          <Input
                                            defaultValue={editingOutcome}
                                            size="lg"
                                            variant="faded"
                                            className="px-1"
                                            onChange={(e) => {
                                              setEditingOutcome(e.target.value)
                                            }}
                                            endContent={<Save className="hover:cursor-pointer" onClick={() => {
                                              const newOutcomeArray = newData.outcomesAndPrices;
                                              newOutcomeArray[editingIndex] = { price: "0", outcome: editingOutcome, tradedQty: 0 }

                                              setNewData({ ...newData, outcomesAndPrices: newOutcomeArray })
                                              setEditingIndex(null)
                                            }} />}
                                          />
                                        </>) : (<>
                                          <ul className="p-2">
                                            <li className="capitalize border-1.5 border-default p-2 rounded-lg flex justify-between" key={i}>{`${i + 1}. ${otcmsAndPrice.outcome}`} <span className="flex gap-4"><Edit onClick={() => {
                                              setEditingIndex(i)
                                              setEditingOutcome(otcmsAndPrice.outcome)
                                            }} className="hover:cursor-pointer" /> <Trash color="#ff2119" className="hover:cursor-pointer"
                                              onClick={() => {
                                                const newOutcomeArray = newData.outcomesAndPrices.filter((otcms) => otcms.outcome !== otcmsAndPrice.outcome)
                                                setNewData({ ...newData, outcomesAndPrices: newOutcomeArray })
                                              }}
                                              /> </span></li>
                                          </ul>
                                        </>)
                                      }
                                    </ div>
                                  ))
                                }

                                <div className="mt-2">
                                  <div className="flex">
                                    <Input variant="faded" className="px-2" placeholder="Add new outcomes"
                                      value={outcome}
                                      onChange={(e) => {
                                        setOutcome(e.target.value);
                                      }} />
                                    <Button
                                      onPress={() => {
                                        if (outcome.length === 0) {
                                          return;
                                        }
                                        setNewData({ ...newData, outcomesAndPrices: [...newData.outcomesAndPrices, { price: "0", outcome: outcome, tradedQty: 0 }] })
                                        setOutcome("")
                                      }}><Send /></Button>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Status section */}
                {
                  selectedTab === "status" && (<>
                    <div>
                      <div>
                        <div>
                          <label htmlFor="Market status">
                            <span className="text-sm font-semibold text-gray-500">
                              Update Market type
                            </span>
                          </label>
                        </div>

                        <Select
                          label="Market status"
                          name="currentStatus"
                          placeholder="Update market ststua"
                          selectionMode="single"
                          variant="bordered"
                          defaultSelectedKeys={[newData.currentStatus]}
                          isRequired
                          onChange={(e) => {
                            setNewData({
                              ...newData,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        >
                          {marketStatus.map((mrktStatus) => (
                            <SelectItem key={mrktStatus.key}>
                              {mrktStatus.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </>)
                }

              </CardBody>
              <CardFooter>
                <Button
                  className="w-full"
                  size="sm"
                  color="primary"

                  onPress={handleMarketDataChange}
                >
                  Sumbit chnages
                </Button>
              </CardFooter>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
