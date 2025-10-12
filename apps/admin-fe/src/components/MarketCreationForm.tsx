import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DatePicker,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { CalendarDateTime } from "@internationalized/date";
import {
  MarketCreationSchema,
  type MarketCreationInterface,
} from "@repo/shared/src";
import { useState } from "react";
import { BACKEND_URI } from "../store/adminStore";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";

export const marketCategory = [
  { key: "crypto", label: "Crypto" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
];

export default function MarketCreationForm() {
  const [formData, setFormData] = useState<MarketCreationInterface>();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);
  const [singleOutcome, setSingleOutcome] = useState("");
  const [singleOutcomeError, setSingleOutcomeError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setStartDateError("");
    setEndDateError("");

    const { success, data, error } = MarketCreationSchema.safeParse(formData);

    if (!success) {
      const errorM =
        error.issues[0].message +
        " at " +
        error.issues[0].path[0].toString() +
        " field";
      setErrorMessage(errorM);
      return;
    }

    // Compare dates
    const currentDateAndTime = Math.floor(new Date().getTime() / 1000);
    if (data!.marketStarts < currentDateAndTime) {
      setStartDateError("Start date and time should not be in past");
      return;
    }

    if (
      data!.marketEnds < currentDateAndTime ||
      data!.marketEnds < data!.marketStarts
    ) {
      setEndDateError(
        "End date and time should not be in past or should not be smaller than Start date and time"
      );
      return;
    }

    if (data.outcomes.length < 2) {
      setErrorMessage("Atleast 2 outcomes needed");
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
        navigate("/admin/console");
      } else {
        setIsFormSubmiting(false);
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-8">
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
                  label="Market starts"
                  labelPlacement="outside"
                  variant="faded"
                  size="lg"
                  granularity="minute"
                  isRequired
                  onChange={(e) => {
                    const values = e as CalendarDateTime;
                    const date = new Date(
                      values.year,
                      values.month - 1,
                      values.day,
                      values.hour,
                      values.minute,
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
                <p className="text-xs text-danger">
                  {startDateError.length !== 0 && startDateError}
                </p>
              </div>

              <div className="flex flex-col w-full">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  label="Market ends"
                  labelPlacement="outside"
                  variant="faded"
                  size="lg"
                  isRequired
                  granularity="minute"
                  onChange={(e) => {
                    const values = e as CalendarDateTime;
                    const date = new Date(
                      values.year,
                      values.month - 1,
                      values.day,
                      values.hour,
                      values.minute,
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
                <p className="text-xs text-danger">
                  {endDateError.length !== 0 && endDateError}
                </p>
              </div>
            </div>
            {/* Market category */}
            <div className="w-full flex flex-col md:flex-row gap-2">
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
            {/* Outcomes */}
            <div className="w-full">
              <p className="mb-1">
                Outcomes <span className="text-danger">*</span>
              </p>
              <Card className="bg-default-100 border-2 border-default-200 shadow-none">
                <CardHeader className="text-default-500">
                  Add outcomes below
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    {typeof formData?.outcomes !== "undefined" &&
                      formData?.outcomes.map((otcms, i) => (
                        <div key={i}>
                          <p className="capitalize font-semibold text-default-500  flex justify-between items-center w-80">
                            <span>{`${i + 1}. ${otcms.title}`}</span>{" "}
                            <span>
                              <Trash2
                                size={18}
                                className="hover:text-danger hover:cursor-pointer transition-all"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev!,
                                    outcomes: [
                                      ...prev!.outcomes.filter(
                                        (otcm) => otcm.title !== otcms.title
                                      ),
                                    ],
                                  }));
                                }}
                              />
                            </span>
                          </p>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-row gap-1">
                    <Input
                      value={singleOutcome}
                      placeholder="Enter outcome"
                      variant="bordered"
                      onChange={(e) => {
                        setSingleOutcomeError("");
                        setSingleOutcome(e.target.value);
                      }}
                    />
                    <Button
                      color="secondary"
                      variant="bordered"
                      onPress={() => {
                        if (singleOutcome.length === 0) {
                          setSingleOutcomeError("Empty field is not allowed");
                          return;
                        }

                        if (
                          formData?.outcomes.some(
                            (ot) => ot.title === singleOutcome
                          )
                        ) {
                          setSingleOutcomeError(
                            "Same outcome is not allowed twice"
                          );
                          return;
                        }
                        setFormData((prev) => ({
                          ...prev!,
                          outcomes: [
                            ...(prev?.outcomes ?? []),
                            {
                              title: singleOutcome,
                              price: 0,
                              totalActiveBet: 0,
                              totalActiveVolume: 0,
                              tradedQty: 0,
                            },
                          ],
                        }));
                        setSingleOutcome("");
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="ml-1 mt-0.5">
                    <p className="text-xs font-semibold text-danger">
                      {singleOutcomeError.length !== 0 && singleOutcomeError}
                      {errorMessage.length !== 0 && errorMessage}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div></div>
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
