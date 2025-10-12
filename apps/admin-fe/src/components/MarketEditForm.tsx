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
import { MarketEditSchema, type MarketByIdInterface } from "@repo/shared/src";
import { useState } from "react";
import { BACKEND_URI } from "../store/adminStore";
import { isEqual } from "lodash";
import { useNavigate } from "react-router";

export const marketCategory = [
  { key: "crypto", label: "Crypto" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
];

export default function MarketEditForm({
  marketData,
}: {
  marketData: MarketByIdInterface;
}) {
  const [formData, setFormData] = useState<MarketByIdInterface>(marketData);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);

  const sTime = new Date(formData.marketStarts * 1000);
  const eTime = new Date(formData.marketEnds * 1000);
  const navigate = useNavigate();

  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setStartDateError("");
    setEndDateError("");

    // Check changes
    const changedData: any = {};
    for (const key of Object.keys(formData) as (keyof MarketByIdInterface)[]) {
      if (!isEqual(formData[key], marketData[key])) {
        changedData[key] = formData[key];
      }
    }

    if (Object.keys(changedData).length === 0) {
      setErrorMessage("No changes to proceed with update");
      return;
    }

    const { success, data, error } = MarketEditSchema.safeParse(changedData);

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
    if (
      data.marketStarts! < currentDateAndTime ||
      data.marketStarts! > data.marketEnds! ||
      data.marketStarts! > formData.marketEnds
    ) {
      setStartDateError(
        "Start date and time should not be in past or should not be greater than end date"
      );
      return;
    }

    if (
      data.marketEnds! < currentDateAndTime ||
      data.marketEnds! < formData.marketStarts ||
      data.marketEnds! < data.marketStarts!
    ) {
      setEndDateError(
        "End date and time should not be in past or should not be smaller than Start date and time"
      );
      return;
    }
    const updateData = { marketId: formData.marketId, data };

    console.log(updateData.data);

    // return;

    try {
      setIsFormSubmiting(true);
      const sendReq = await fetch(`${BACKEND_URI}/admin/edit-market`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const res = await sendReq.json();
      if (res.success) {
        setIsFormSubmiting(false);
        navigate(`/admin/market/${formData.marketId}`);
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
            <span className="font-semibold text-xs">Edit market</span>
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
                defaultValue={formData.title}
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
                defaultValue={formData.description}
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
                defaultValue={formData.settlement}
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
                  defaultValue={
                    new CalendarDateTime(
                      sTime.getFullYear(),
                      sTime.getMonth() + 1,
                      sTime.getDate(),
                      sTime.getHours(),
                      sTime.getMinutes()
                    )
                  }
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
                  defaultValue={
                    new CalendarDateTime(
                      eTime.getFullYear(),
                      eTime.getMonth() + 1,
                      eTime.getDate(),
                      eTime.getHours(),
                      eTime.getMinutes()
                    )
                  }
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
                  defaultSelectedKeys={[formData.marketCategory]}
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
              <p className="mb-1">{`Outcomes (outcomes can't be modified)`}</p>
              <Card className="bg-default-100 border-2 border-default-200 shadow-none">
                <CardHeader className="text-default-500">
                  {`Outcomes`}
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    {typeof formData?.outcomes !== "undefined" &&
                      formData?.outcomes.map((otcms, i) => (
                        <div key={i}>
                          <p className="capitalize font-semibold text-default-500  flex justify-between items-center w-80">
                            <span>{`${i + 1}. ${otcms.title}`}</span>
                          </p>
                        </div>
                      ))}
                  </div>
                </CardBody>
              </Card>
            </div>
            <div>
              <p className="text-xs text-danger">
                {errorMessage.length !== 0 && errorMessage}
              </p>
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
